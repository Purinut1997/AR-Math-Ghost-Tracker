export interface SampleSpot {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
}

export const SAMPLE_SCHOOL_SPOTS: SampleSpot[] = [
  {
    id: 'spot-desk',
    name: 'โต๊ะเรียนไม้และสมุดจด',
    location: 'ห้องเรียนชั้น ป.3/1',
    description: 'โต๊ะไม้โบราณที่สลักรอยขีดเขียนและกองสมุดคณิตศาสตร์',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-board',
    name: 'กระดานดำและชอล์กสี',
    location: 'ห้องเรียนคณิตศาสตร์เก่า',
    description: 'กระดานดำที่มีรอยเขียนตัวเลขลบไม่ออกจางๆ',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-books',
    name: 'กองหนังสือเรียนและกล่องดินสอ',
    location: 'ห้องสมุดโรงเรียนชั้น 2',
    description: 'ตำราคณิตศาสตร์กองโตกับดินสอที่เหมือนจะขยับได้เอง',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-chair',
    name: 'เก้าอี้เรียนไม้ตัวโดดเดี่ยว',
    location: 'มุมมืดท้ายห้องเรียน',
    description: 'เก้าอี้เรียนไม้ที่มักมีเสียงเอี๊ยดอ๊าดตอนไม่มีใครนั่ง',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-clock',
    name: 'นาฬิกาแขวนโบราณ',
    location: 'หน้าห้องพักครู',
    description: 'นาฬิกาบอกเวลาเลิกเรียนที่เข็มนาฬิกาชอบหมุนทวนเข็ม',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-backpack',
    name: 'กระเป๋านักเรียนและกระบอกน้ำ',
    location: 'ล็อคเกอร์แถวที่ 4',
    description: 'กระเป๋าที่มีการบ้านคณิตศาสตร์ซ่อนอยู่ข้างใน',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-lockers',
    name: 'ตู้ล็อคเกอร์เหล็กแถวยาว',
    location: 'โถงทางเดินชั้น 3',
    description: 'ตู้ล็อคเกอร์ที่มีเสียงเคาะจากด้านในเมื่อไม่มีคนอยู่',
    imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-computer',
    name: 'จอคอมพิวเตอร์และแป้นพิมพ์ห้องแล็บ',
    location: 'ห้องปฏิบัติการคอมพิวเตอร์',
    description: 'หน้าจอที่แสดงโค้ดตัวเลขกระพริบเป็นปริศนาคำสาป',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-globe',
    name: 'ลูกโลกจำลองและแผนที่โลก',
    location: 'ห้องสังคมศึกษาและภูมิศาสตร์',
    description: 'ลูกโลกที่หมุนเองช้าๆ ไปยังพิกัดลี้ลับบนแผนที่',
    imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-microscope',
    name: 'กล้องจุลทรรศน์และบีกเกอร์แก้ว',
    location: 'ห้องทดลองวิทยาศาสตร์',
    description: 'หลอดทดลองและสไลด์แก้วที่ส่องเห็นเซลล์ตัวเลขปริศนา',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-window',
    name: 'หน้าต่างบานเกล็ดและเงาไม้นอกระเบียง',
    location: 'ระเบียงอาคารเก่า',
    description: 'ลมพัดบานเกล็ดสั่นไหวและมีตัวเลขสลักอยู่บนกระจก',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spot-hallway',
    name: 'ทางเดินบันไดวนอาคาร 1',
    location: 'บันไดขึ้นดาดฟ้าโรงเรียน',
    description: 'บันไดที่นับจำนวนขั้นตอนขึ้นและลงได้ไม่เท่ากัน!',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  },
];
