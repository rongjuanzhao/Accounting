import prisma from '../../../server/prisma/client';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const bills = await prisma.bill.findMany({
        orderBy: { date: 'desc' }
      });
      
      // 解析存储在description字段中的JSON字符串
      const parsedBills = bills.map(bill => {
        return {
          ...bill,
          description: JSON.parse(bill.description)
        };
      });
      
      res.status(200).json(parsedBills);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      // 先尝试查找现有记录
      const existingBill = await prisma.bill.findFirst({
        orderBy: { date: 'desc' }
      });
      
      // 将前端发送的扁平数据结构转换为Bill模型
      const billData = {
        title: '资产数据',
        amount: 0, // 总金额需要计算
        date: new Date(),
        category: '资产',
        subCategory: '',
        description: JSON.stringify(req.body) // 将前端数据存储在description中
      };
      
      let bill;
      if (existingBill) {
        // 如果存在现有记录，则更新它
        bill = await prisma.bill.update({
          where: { id: existingBill.id },
          data: billData
        });
      } else {
        // 如果不存在现有记录，则创建新记录
        bill = await prisma.bill.create({
          data: billData
        });
      }
      
      // 解析存储在description字段中的JSON字符串
      const parsedBill = {
        ...bill,
        description: JSON.parse(bill.description)
      };
      
      res.status(200).json(parsedBill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}