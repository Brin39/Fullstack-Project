import { RequestHandler } from 'express';
import Order from '../models/Order';

// סטטוסים של הזמנות תקפים
export const VALID_ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof VALID_ORDER_STATUSES[number];

// תוכנת ביניים לאימות סטטוס
export const validateOrderStatus: RequestHandler = (req, res, next) => {
     const { status } = req.body;

     if (!status) {
          res.status(400).json({ message: 'Status is required' });
          return;
     }

     if (!VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
          res.status(400).json({
               message: 'Invalid status',
               validStatuses: VALID_ORDER_STATUSES
          });
          return;
     }

     next();
};

// תוכנת ביניים לאימות הזמנה
export const validateStatusTransition: RequestHandler = async (req, res, next) => {
     try {
          const order = await Order.findById(req.params.id);
          if (!order) {
               res.status(404).json({ message: 'Order not found' });
               return;
          }

          const currentStatus = order.status;
          const newStatus = req.body.status;

          // בדיקה של תהליכים סטטוס תקינים
          const validTransitions: Record<OrderStatus, OrderStatus[]> = {
               pending: ['processing', 'cancelled'],
               processing: ['shipped', 'cancelled'],
               shipped: ['delivered'],
               delivered: [], // לא ניתן לשנות את סטטוס הזמנה שהתקבלה
               cancelled: [] // לא ניתן לשנות את סטטוס הזמנה שנבטלה
          };

          if (!validTransitions[currentStatus as OrderStatus].includes(newStatus as OrderStatus)) {
               res.status(400).json({
                    message: `Cannot change status from ${currentStatus} to ${newStatus}`,
                    validTransitions: validTransitions[currentStatus as OrderStatus]
               });
               return;
          }

          next();
     } catch (error) {
          console.error('Error validating status transition:', error);
          res.status(500).json({ message: 'Error validating status transition' });
     }
}; 