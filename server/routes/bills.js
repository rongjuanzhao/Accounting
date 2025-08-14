import express from 'express';
import Bill from '../models/Bill.js';

const router = express.Router();

// 获取所有账单
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新账单
router.post('/', async (req, res) => {
  const bill = new Bill({
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description
  });

  try {
    const newBill = await bill.save();
    res.status(201).json(newBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新账单
router.patch('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (bill) {
      Object.assign(bill, req.body);
      const updatedBill = await bill.save();
      res.json(updatedBill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除账单
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (bill) {
      await bill.deleteOne();
      res.json({ message: 'Bill deleted' });
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 