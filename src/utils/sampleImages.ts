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
    name: 'นาฬิกาแขวนและชั้นวางของ',
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
];
