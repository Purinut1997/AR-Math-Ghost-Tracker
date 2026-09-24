import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('Warning: GEMINI_API_KEY is not defined in process.env');
}

// Procedural fallback ghosts generator per grade level with rich variety and randomized numbers
function getFallbackGhost(gradeLevel: string = 'ป.3') {
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const variant = randInt(1, 3);

  if (gradeLevel === 'ป.1') {
    if (variant === 1) {
      const a = randInt(6, 12);
      const b = randInt(3, 8);
      const ans = a + b;
      return {
        ghost_type: 'วิญญาณลูกคิดหรรษา',
        ghost_emoji: '🧮',
        narrative: 'ข้าคือลูกคิดเก่าที่นับเลขไม่ครบ! คำสาปตัวเลขกำลังครอบงำห้องนี้!',
        math_question: `บนโต๊ะมีสมุด ${a} เล่ม วางเพิ่มอีก ${b} เล่ม รวมมีสมุดทั้งหมดกี่เล่ม?`,
        correct_answer: ans,
        choices: [ans, ans + 1, Math.max(1, ans - 1), ans + 2].sort(() => Math.random() - 0.5),
      };
    } else if (variant === 2) {
      const a = randInt(10, 18);
      const b = randInt(4, 9);
      const ans = a - b;
      return {
        ghost_type: 'ผีกล่องชอล์กแสนซน',
        ghost_emoji: '🖍️',
        narrative: 'ชอล์กสีเหล่านี้แอบเขียนข้อความเองตอนเที่ยงคืน! ปลดปล่อยพวกเราที!',
        math_question: `ในกล่องมีชอล์กสี ${a} แท่ง หักใช้ไประหว่างเรียน ${b} แท่ง เหลือชอล์กสภาพดีกี่แท่ง?`,
        correct_answer: ans,
        choices: [ans, ans + 1, Math.max(1, ans - 1), ans + 3].sort(() => Math.random() - 0.5),
      };
    } else {
      const a = randInt(5, 10);
      const b = randInt(3, 7);
      const ans = a + b;
      return {
        ghost_type: 'วิญญาณขวดน้ำเรืองแสง',
        ghost_emoji: '🍶',
        narrative: 'น้ำในกระติกกำลังสั่นไหวเป็นระลอกคลื่นตัวเลข!',
        math_question: `มีกระบอกน้ำสีฟ้า ${a} ใบ และกระบอกน้ำสีเขียว ${b} ใบ รวมมีกระบอกน้ำกี่ใบ?`,
        correct_answer: ans,
        choices: [ans, ans + 2, Math.max(1, ans - 1), ans + 1].sort(() => Math.random() - 0.5),
      };
    }
  }

  if (gradeLevel === 'ป.2') {
    if (variant === 1) {
      const a = randInt(25, 70);
      const b = randInt(12, 28);
      const ans = a + b;
      return {
        ghost_type: 'ผีไม้บรรทัดไร้ศูนย์',
        ghost_emoji: '📏',
        narrative: 'ข้าคือไม้บรรทัดที่วัดระยะผิดจนวิญญาณสถิต! จงหาผลลัพธ์นี้เพื่อปลดปล่อยข้า!',
        math_question: `เชือกสีแดงยาว ${a} เซนติเมตร เชือกสีดำยาวกว่าอยู่ ${b} เซนติเมตร เชือกสีดำยาวเท่าไร?`,
        correct_answer: ans,
        choices: [ans, ans + 5, Math.max(1, ans - 5), ans + 10].sort(() => Math.random() - 0.5),
      };
    } else if (variant === 2) {
      const piles = randInt(3, 6);
      const perPile = randInt(4, 8);
      const total = piles * perPile;
      return {
        ghost_type: 'ปีศาจกองสมุดการบ้าน',
        ghost_emoji: '📚',
        narrative: 'การบ้านคณิตศาสตร์กองโตกำลังลอยขึ้นกลางห้องด้วยพลังอาถรรพ์สูตรคูณ!',
        math_question: `จัดกองหนังสือเรียน ${piles} กอง กองละ ${perPile} เล่มเท่าๆ กัน รวมมีหนังสือทั้งหมดกี่เล่ม?`,
        correct_answer: total,
        choices: [total, total + piles, Math.max(1, total - piles), total + 4].sort(() => Math.random() - 0.5),
      };
    } else {
      const start = randInt(120, 350);
      const spent = randInt(40, 95);
      const ans = start - spent;
      return {
        ghost_type: 'วิญญาณกระเป๋าสตางค์จำศีล',
        ghost_emoji: '👛',
        narrative: 'เหรียญในกระเป๋าดังกรุ๊งกริ๊งไม่ยอมหยุดตามจังหวะตัวเลข!',
        math_question: `มีเงินสะสม ${start} บาท ซื้อสมุดวาดภาพไป ${spent} บาท จะเหลือเงินกี่บาท?`,
        correct_answer: ans,
        choices: [ans, ans + 10, Math.max(1, ans - 10), ans + 20].sort(() => Math.random() - 0.5),
      };
    }
  }

  if (gradeLevel === 'ป.4') {
    if (variant === 1) {
      const rows = randInt(12, 24);
      const perRow = randInt(8, 15);
      const total = rows * perRow;
      return {
        ghost_type: 'ปีศาจหนังสือเรียนปิดตาย',
        ghost_emoji: '📖',
        narrative: 'หน้ากระดาษหนังสือเล่มนี้กำลังพลิกเองด้วยแรงอาถรรพ์การคูณ!',
        math_question: `ห้องประชุมจัดเก้าอี้ไว้ ${rows} แถว แต่ละแถวมีเก้าอี้ ${perRow} ตัว รวมมีเก้าอี้ทั้งหมดกี่ตัว?`,
        correct_answer: total,
        choices: [total, total - 10, total + 10, total + 20].sort(() => Math.random() - 0.5),
      };
    } else if (variant === 2) {
      const width = randInt(6, 14);
      const length = randInt(15, 30);
      const area = width * length;
      return {
        ghost_type: 'วิญญาณกระดานดำอาถรรพ์',
        ghost_emoji: '🪟',
        narrative: 'กระดานดำเรืองแสงเป็นตารางกริดปริศนา จงหาพื้นที่เพื่อสลายมนต์ดำ!',
        math_question: `กระดานดำรูปสี่เหลี่ยมผืนผ้า กว้าง ${width} เมตร ยาว ${length} เมตร จะมีพื้นที่กี่ตารางเมตร?`,
        correct_answer: area,
        choices: [area, area + width, Math.max(1, area - width), area + 20].sort(() => Math.random() - 0.5),
      };
    } else {
      const total = randInt(120, 240);
      const groups = randInt(4, 8);
      const ans = Math.floor(total / groups);
      return {
        ghost_type: 'ผีลูกแก้วกระจกแตกร้าว',
        ghost_emoji: '🔮',
        narrative: 'ลูกแก้วสะท้อนภาพเงาหลอนที่ต้องการแบ่งสรรปันส่วนอย่างเท่าเทียม!',
        math_question: `มีลูกแก้วเวทมนตร์ ${groups * ans} ลูก แบ่งใส่ถุง ${groups} ถุงเท่าๆ กัน แต่ละถุงจะได้กี่ลูก?`,
        correct_answer: ans,
        choices: [ans, ans + 2, Math.max(1, ans - 2), ans + 4].sort(() => Math.random() - 0.5),
      };
    }
  }

  if (gradeLevel === 'ป.5') {
    if (variant === 1) {
      const base = randInt(30, 90) * 10; // 300 - 900
      const discount = randInt(1, 4) * 10; // 10%, 20%, 30%, 40%
      const ans = (base * discount) / 100;
      return {
        ghost_type: 'ผีนาฬิกาทรายสูญสลาย',
        ghost_emoji: '⏳',
        narrative: 'ทรายแห่งกาลเวลากำลังไหลย้อนกลับด้วยคำสาปร้อยละและสัดส่วน!',
        math_question: `กระเป๋านักเรียนติดป้ายราคา ${base} บาท ทางร้านจัดโปรโมชั่นลดราคา ${discount}% จะได้ส่วนลดกี่บาท?`,
        correct_answer: ans,
        choices: [ans, ans + 20, Math.max(1, ans - 20), ans + 50].sort(() => Math.random() - 0.5),
      };
    } else if (variant === 2) {
      const w = randInt(3, 8);
      const l = randInt(4, 10);
      const h = randInt(2, 6);
      const vol = w * l * h;
      return {
        ghost_type: 'ปีศาจกล่องไม้ต้องสาป',
        ghost_emoji: '📦',
        narrative: 'กล่องไม้มิติพิศวงกำลังดูดกลืนสิ่งของด้วยสูตรหาปริมาตรทรงสี่เหลี่ยมมุมฉาก!',
        math_question: `กล่องทรงสี่เหลี่ยมมุมฉาก กว้าง ${w} ซม. ยาว ${l} ซม. สูง ${h} ซม. มีปริมาตรกี่ลูกบาศก์เซนติเมตร?`,
        correct_answer: vol,
        choices: [vol, vol + 10, Math.max(1, vol - 10), vol + 24].sort(() => Math.random() - 0.5),
      };
    } else {
      const price = randInt(40, 150);
      const vat = 10;
      const ans = (price * vat) / 100;
      return {
        ghost_type: 'วิญญาณใบเสร็จมืดมน',
        ghost_emoji: '🧾',
        narrative: 'ตัวเลขทศนิยมบนใบเสร็จกำลังบิดเบี้ยวเป็นใบหน้าของภูติผี!',
        math_question: `สมุดบันทึกราคาเล่มละ ${price} บาท ต้องจ่ายภาษีร้อยละ ${vat}% คิดเป็นเงินภาษีกี่บาท?`,
        correct_answer: ans,
        choices: [ans, ans + 2, Math.max(0.5, ans - 2), ans + 5].sort(() => Math.random() - 0.5),
      };
    }
  }

  if (gradeLevel === 'ป.6') {
    if (variant === 1) {
      const x = randInt(5, 16);
      const m = randInt(2, 6);
      const c = randInt(5, 20);
      const total = m * x + c;
      return {
        ghost_type: 'จอมมารสมการตัวแปร x',
        ghost_emoji: '🔮',
        narrative: 'พลังแห่งความลึกลับของตัวแปร x กำลังสะกดห้องเรียนนี้ไว้ จงถอดรหัสหาค่า x!',
        math_question: `จงหาค่าของ x จากสมการ: ${m}x + ${c} = ${total}`,
        correct_answer: x,
        choices: [x, x + 2, Math.max(1, x - 2), x + 4].sort(() => Math.random() - 0.5),
      };
    } else if (variant === 2) {
      const cost = randInt(20, 60) * 10; // 200 - 600
      const profitRate = randInt(1, 4) * 10; // 10%, 20%, 30%, 40%
      const profit = (cost * profitRate) / 100;
      const sale = cost + profit;
      return {
        ghost_type: 'ภูติเหรียญทองคำสาป',
        ghost_emoji: '🪙',
        narrative: 'ความโลภและการค้าขายในอดีตปลุกปีศาจกำไรขึ้นมา!',
        math_question: `ซื้อชุดเครื่องเขียนมาราคาต้นทุน ${cost} บาท ขายต่อได้กำไร ${profitRate}% ขายชุดเครื่องเขียนนี้ได้กำไรกี่บาท?`,
        correct_answer: profit,
        choices: [profit, profit + 20, Math.max(10, profit - 20), profit + 40].sort(() => Math.random() - 0.5),
      };
    } else {
      const x = randInt(7, 20);
      const m = randInt(3, 5);
      const c = randInt(6, 18);
      const total = m * x - c;
      return {
        ghost_type: 'ราชันย์เงาแห่งสัดส่วน',
        ghost_emoji: '👑',
        narrative: 'คำสาปสมการลบกำลังกัดกร่อนความจริง จงค้นหาค่าของตัวแปร x!',
        math_question: `จงแก้สมการหาค่า x: ${m}x - ${c} = ${total}`,
        correct_answer: x,
        choices: [x, x + 3, Math.max(1, x - 3), x + 5].sort(() => Math.random() - 0.5),
      };
    }
  }

  // Default: ป.3
  if (variant === 1) {
    const rows = randInt(4, 9);
    const cols = randInt(5, 8);
    const occupied = randInt(6, Math.min(rows * cols - 5, 25));
    const empty = rows * cols - occupied;
    return {
      ghost_type: 'ผีโต๊ะเรียนอาถรรพ์',
      ghost_emoji: '🪵',
      narrative: 'โต๊ะตัวนี้เคยมีนักเรียนสอบตกวิชาเลขร้องไห้จนเกิดพลังงานอาถรรพ์ ปลดปล่อยข้าด้วยการคำนวณ!',
      math_question: `โต๊ะเรียนในห้องมี ${rows} แถว แถวละ ${cols} ตัว มีนักเรียนนั่งไปแล้ว ${occupied} ตัว จะเหลือโต๊ะว่างกี่ตัว?`,
      correct_answer: empty,
      choices: [empty, empty + 2, Math.max(1, empty - 2), empty + 4].sort(() => Math.random() - 0.5),
    };
  } else if (variant === 2) {
    const hours = randInt(2, 5);
    const mins = hours * 60;
    return {
      ghost_type: 'วิญญาณนาฬิกาตายหน้าห้อง',
      ghost_emoji: '🕰️',
      narrative: 'เข็มนาฬิกาโบราณชอบเดินทวนเข็มยามเที่ยงคืน เพื่อขโมยเวลานักเรียน!',
      math_question: `นักเรียนทำกิจกรรมปราบผีเป็นเวลา ${hours} ชั่วโมง คิดเป็นเวลากี่นาที?`,
      correct_answer: mins,
      choices: [mins, mins + 30, Math.max(30, mins - 30), mins + 60].sort(() => Math.random() - 0.5),
    };
  } else {
    const boxes = randInt(4, 7);
    const perBox = randInt(6, 10);
    const total = boxes * perBox;
    return {
      ghost_type: 'ปีศาจกล่องชอล์กหายนะ',
      ghost_emoji: '📦',
      narrative: 'ชอล์กในกล่องกำลังถูกบดขยี้ด้วยแรงลึกลับจนเกิดควันตัวเลข!',
      math_question: `ครูซื้อชอล์กมา ${boxes} กล่อง แต่ละกล่องมีชอล์ก ${perBox} แท่ง รวมมีชอล์กทั้งหมดกี่แท่ง?`,
      correct_answer: total,
      choices: [total, total + boxes, Math.max(1, total - boxes), total + 6].sort(() => Math.random() - 0.5),
    };
  }
}

function enrichGhostData(ghost: any) {
  if (!ghost.explanation_steps || !Array.isArray(ghost.explanation_steps) || ghost.explanation_steps.length === 0) {
    ghost.explanation_steps = [
      `ขั้นที่ 1: พิจารณาโจทย์ "${ghost.math_question}"`,
      `ขั้นที่ 2: ตั้งสมการหรือประโยคสัญลักษณ์ตามลำดับการคำนวณ`,
      `ขั้นที่ 3: คำนวณผลลัพธ์ ได้คำตอบคือ ${ghost.correct_answer}`,
    ];
  }
  return ghost;
}

// API endpoint to analyze camera image and generate ghost encounter
app.post('/api/scan-ghost', async (req, res) => {
  const gradeLevel = (req.body?.gradeLevel as string) || 'ป.3';

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'ไม่พบข้อมูลภาพถ่าย' });
    }

    if (!ai) {
      console.log('Using fallback ghost (No GEMINI_API_KEY configured)');
      const fallback = enrichGhostData(getFallbackGhost(gradeLevel));
      return res.json(fallback);
    }

    // Extract base64 data and mimeType
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    }

    const gradeLevelGuide: Record<string, string> = {
      'ป.1': 'การบวกและการลบจำนวนนับไม่เกิน 20 ถึง 100 เน้นการนับสิ่งของรอบตัว, เปรียบเทียบมากกว่า/น้อยกว่า',
      'ป.2': 'การบวก-ลบจำนวนนับไม่เกิน 1,000, การคูณแม่ 2, 3, 5, 10, โจทย์การวัดความยาวเซนติเมตร',
      'ป.3': 'การคูณและการหารจำนวน 1-2 หลัก, การแก้โจทย์ปัญหา 2 ขั้นตอน (ระคน เช่น มีของ A กลุ่ม กลุ่มละ B ชิ้น ลบออก C ชิ้น)',
      'ป.4': 'การคูณและหารจำนวนหลายหลัก, การบวก-ลบเศษส่วนที่ตัวส่วนเท่ากัน, การหาพื้นที่หรือความยาวรอบรูป',
      'ป.5': 'เศษส่วน, ทศนิยม 1-2 ตำแหน่ง, การคำนวณร้อยละ/เปอร์เซ็นต์เบื้องต้น, ปริมาตรทรงสี่เหลี่ยมมุมฉาก',
      'ป.6': 'สมการเชิงเส้นตัวแปรเดียว (เช่น ax + b = c ให้หาค่า x), ร้อยละ/กำไร-ขาดทุน, อัตราส่วน, พื้นที่รูปหลายเหลี่ยม',
    };

    const systemInstruction = `บทบาทของคุณ:
คุณคือ "ผู้คุมเกม" (Game Master) ของเกม "AR Math Ghost Tracker: ตำนานสมการซ่อนแอบ" ซึ่งเป็นเกม AR แนวสยองขวัญลึกลับที่เป็นมิตรกับเด็กนักเรียนชั้นประถม โดยนำความน่ากลัวมาผสมผสานกับการแก้โจทย์ปัญหาคณิตศาสตร์

เนื้อเรื่องและบริบท:
โรงเรียนกำลังถูกคุกคามโดย "วิญญาณจอมป่วน" ที่สอบตกวิชาคณิตศาสตร์และมีความอาฆาต พวกมันจึงสิงสถิตอยู่ตามสิ่งของต่างๆ ในโลกจริง วิธีเดียวที่จะปลดปล่อยพวกมันได้ คือให้ผู้เล่น (นักเรียน) ใช้กล้องสแกนหาวิญญาณ และแก้ "คำสาปตัวเลข" (โจทย์คณิตศาสตร์) ที่วิญญาณเหล่านั้นสร้างขึ้นให้ถูกต้อง

หน้าที่ของคุณ:
ทุกครั้งที่ผู้เล่นส่ง "ภาพถ่าย" (รูปสถานที่หรือสิ่งของจริงจากกล้อง) เข้ามาให้ คุณจะต้องทำตามขั้นตอนดังนี้:
1. วิเคราะห์หาสิ่งของที่โดดเด่นที่สุดในภาพนั้น (เช่น โต๊ะ, เก้าอี้, แก้วน้ำ, หนังสือ, หน้าต่าง, กระเป๋า, พัดลม, หลอดไฟ ฯลฯ)
2. แต่งเรื่องราวสยองขวัญสั้นๆ (ไม่เกิน 2 ประโยค) ที่เชื่อมโยงสิ่งของในภาพนั้นเข้ากับการปรากฏตัวของวิญญาณ (แนวสนุกสนานปนตื่นเต้น เหมาะกับเด็กประถม ไม่รุนแรงหรือลามก)
3. สร้างโจทย์ปัญหาคณิตศาสตร์สำหรับเด็กระดับชั้น ${gradeLevel} โดยให้เนื้อหาของโจทย์อ้างอิงจากสิ่งของในภาพนั้นโดยตรง
   - เกณฑ์หลักสูตรสำหรับชั้น ${gradeLevel}: ${gradeLevelGuide[gradeLevel] || 'ตามหลักสูตรแกนกลางคณิตศาสตร์ประถม'}
   - คำตอบต้องเป็นจำนวนเต็มบวก (Integer) ชัดเจน ไม่ติดเศษทศนิยมยาว
4. สร้างตัวเลือกคำตอบ 4 ข้อ โดยต้องมีข้อที่ถูกต้องเพียงข้อเดียวเท่านั้น และตัวเลือกต้องมี correct_answer รวมอยู่ด้วย

รูปแบบการตอบกลับ:
ตอบกลับเป็น JSON ตาม schema ที่กำหนดเท่านั้น`;

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `จงวิเคราะห์ภาพถ่ายนี้ในฐานะ Game Master ของ AR Math Ghost Tracker สำหรับเด็กระดับชั้น ${gradeLevel} สร้างวิญญาณสิงสถิต เรื่องเล่าสยองขวัญสั้น และโจทย์คำสาปคณิตศาสตร์ที่เกี่ยวกับสิ่งของในรูป`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ghost_type: {
              type: Type.STRING,
              description: 'ตั้งชื่อวิญญาณให้เข้ากับภาพ (เช่น ผีเก้าอี้หัก, วิญญาณไม้บรรทัด)',
            },
            ghost_emoji: {
              type: Type.STRING,
              description: 'ใส่อีโมจิ 1 ตัวที่สื่อถึงวิญญาณตัวนี้ (เช่น 👻, 🪑, 📏)',
            },
            narrative: {
              type: Type.STRING,
              description: 'ประโยคสยองขวัญสั้นๆ หรือคำพูดของวิญญาณที่อ้างอิงจากสิ่งของในรูป (ไม่เกิน 2 ประโยค)',
            },
            math_question: {
              type: Type.STRING,
              description: 'โจทย์ปัญหาคณิตศาสตร์ที่สอดคล้องกับภาพ',
            },
            correct_answer: {
              type: Type.NUMBER,
              description: 'ตัวเลขคำตอบที่ถูกต้อง',
            },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.NUMBER,
              },
              description: 'ตัวเลือกคำตอบ 4 ข้อ',
            },
            explanation_steps: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'ขั้นตอนการแสดงวิธีคิดหรือเฉลยคำตอบทีละขั้น (2-3 บรรทัด) เพื่อสอนน้องๆ ให้เข้าใจ',
            },
          },
          required: [
            'ghost_type',
            'ghost_emoji',
            'narrative',
            'math_question',
            'correct_answer',
            'choices',
          ],
        },
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const parsedData = JSON.parse(responseText);

    // Validate choices array contains correct_answer
    let choices: number[] = Array.isArray(parsedData.choices) ? parsedData.choices : [];
    const correctAnswer: number = Number(parsedData.correct_answer);

    if (!choices.includes(correctAnswer)) {
      if (choices.length >= 4) {
        choices[0] = correctAnswer;
      } else {
        choices.push(correctAnswer);
      }
    }

    // Ensure 4 unique choices
    const uniqueChoices = Array.from(new Set(choices));
    while (uniqueChoices.length < 4) {
      const offset = uniqueChoices.length % 2 === 0 ? uniqueChoices.length : -uniqueChoices.length;
      const candidate = correctAnswer + offset;
      if (!uniqueChoices.includes(candidate)) {
        uniqueChoices.push(candidate);
      }
    }
    // Shuffle choices
    const shuffledChoices = uniqueChoices.slice(0, 4).sort(() => Math.random() - 0.5);

    const defaultSteps = [
      `ขั้นที่ 1: ทำความเข้าใจโจทย์ "${parsedData.math_question || ''}"`,
      `ขั้นที่ 2: ดำเนินการคำนวณตามหลักคณิตศาสตร์`,
      `ขั้นที่ 3: สรุปผลลัพธ์ ได้คำตอบคือ ${correctAnswer}`,
    ];

    const result = {
      ghost_type: parsedData.ghost_type || 'วิญญาณนิรนามในห้องเรียน',
      ghost_emoji: parsedData.ghost_emoji || '👻',
      narrative: parsedData.narrative || 'มีวิญญาณแอบซ่อนอยู่ในเงามืดของวัตถุชิ้นนี้!',
      math_question: parsedData.math_question || 'ถ้ามีผี 3 ตัว มาเพิ่มอีก 5 ตัว รวมเป็นผีกี่ตัว?',
      correct_answer: correctAnswer,
      choices: shuffledChoices,
      explanation_steps: Array.isArray(parsedData.explanation_steps) && parsedData.explanation_steps.length > 0
        ? parsedData.explanation_steps
        : defaultSteps,
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Gemini API notice (using procedural fallback):', error?.message || error);
    // Graceful fallback so game keeps going seamlessly with zero downtime
    const fallback = enrichGhostData(getFallbackGhost(gradeLevel));
    return res.json(fallback);
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'AR Math Ghost Tracker',
    hasApiKey: !!apiKey,
  });
});

// Setup Vite middleware in dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`AR Math Ghost Tracker server running on port ${PORT}`);
  });
}

startServer();
