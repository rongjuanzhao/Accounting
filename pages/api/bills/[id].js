import prisma from '../../../server/prisma/client';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const bill = await prisma.bill.update({
        where: { id: parseInt(id) },
        data: {
          date: new Date(),
          description: JSON.stringify(req.body) // 更新数据
        }
      });
      
      // 解析存储在description字段中的JSON字符串
      const parsedBill = {
        ...bill,
        description: JSON.parse(bill.description)
      };
      
      res.status(200).json(parsedBill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.bill.delete({
        where: { id: parseInt(id) }
      });
      res.status(200).json({ message: 'Bill deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}