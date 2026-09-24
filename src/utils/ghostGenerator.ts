import { GradeLevel } from '../types';

export interface GeneratedGhostData {
  ghost_type: string;
  ghost_emoji: string;
  narrative: string;
  math_question: string;
  correct_answer: number;
  choices: number[];
  explanation_steps: string[];
}

export function getProceduralGhost(gradeLevel: GradeLevel = 'ป.3'): GeneratedGhostData {
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const variant = randInt(1, 3);

  let data: {
    ghost_type: string;
    ghost_emoji: string;
    narrative: string;
    math_question: string;
    correct_answer: number;
    choices: number[];
    explanation_steps?: string[];
  };

  if (gradeLevel === 'ป.1') {
    if (variant === 1) {
      const a = randInt(6, 12);
      const b = randInt(3, 8);
      const ans = a + b;
      data = {
        ghost_type: 'วิญญาณลูกคิดหรรษา',
        ghost_emoji: '🧮',
        narrative: 'ข้าคือลูกคิดเก่าที่นับเลขไม่ครบ! คำสาปตัวเลขกำลังครอบงำห้องนี้!',
        math_question: `บนโต๊ะมีสมุด ${a} เล่ม วางเพิ่มอีก ${b} เล่ม รวมมีสมุดทั้งหมดกี่เล่ม?`,
        correct_answer: ans,
        choices: [ans, ans + 1, Math.max(1, ans - 1), ans + 2],
        explanation_steps: [
          `ขั้นตอนที่ 1: โจทย์บอกว่ามีสมุดเดิม ${a} เล่ม วางเพิ่มอีก ${b} เล่ม`,
          `ขั้นตอนที่ 2: นำมาบวกกัน: ${a} + ${b}`,
          `ขั้นตอนที่ 3: คำนวณได้ผลลัพธ์คือ ${ans} เล่ม`,
        ],
      };
    } else if (variant === 2) {
      const a = randInt(10, 18);
      const b = randInt(4, 9);
      const ans = a - b;
      data = {
        ghost_type: 'ผีกล่องชอล์กแสนซน',
        ghost_emoji: '🖍️',
        narrative: 'ชอล์กสีเหล่านี้แอบเขียนข้อความเองตอนเที่ยงคืน! ปลดปล่อยพวกเราที!',
        math_question: `ในกล่องมีชอล์กสี ${a} แท่ง หักใช้ไประหว่างเรียน ${b} แท่ง เหลือชอล์กสภาพดีกี่แท่ง?`,
        correct_answer: ans,
        choices: [ans, ans + 1, Math.max(1, ans - 1), ans + 3],
        explanation_steps: [
          `ขั้นตอนที่ 1: มีชอล์กทั้งหมด ${a} แท่ง ใช้ไป ${b} แท่ง`,
          `ขั้นตอนที่ 2: ตั้งประโยคสัญลักษณ์: ${a} - ${b}`,
          `ขั้นตอนที่ 3: หักลบแล้วเหลือชอล์ก ${ans} แท่ง`,
        ],
      };
    } else {
      const a = randInt(5, 10);
      const b = randInt(3, 7);
      const ans = a + b;
      data = {
        ghost_type: 'วิญญาณขวดน้ำเรืองแสง',
        ghost_emoji: '🍶',
        narrative: 'น้ำในกระติกกำลังสั่นไหวเป็นระลอกคลื่นตัวเลข!',
        math_question: `มีกระบอกน้ำสีฟ้า ${a} ใบ และกระบอกน้ำสีเขียว ${b} ใบ รวมมีกระบอกน้ำกี่ใบ?`,
        correct_answer: ans,
        choices: [ans, ans + 2, Math.max(1, ans - 1), ans + 1],
        explanation_steps: [
          `ขั้นตอนที่ 1: นับกระบอกน้ำสีฟ้า ${a} ใบ รวมกับสีเขียว ${b} ใบ`,
          `ขั้นตอนที่ 2: รวมเป็น ${a} + ${b}`,
          `ขั้นตอนที่ 3: ได้ผลลัพธ์ทั้งหมด ${ans} ใบ`,
        ],
      };
    }
  } else if (gradeLevel === 'ป.2') {
    if (variant === 1) {
      const a = randInt(25, 70);
      const b = randInt(12, 28);
      const ans = a + b;
      data = {
        ghost_type: 'ผีไม้บรรทัดไร้ศูนย์',
        ghost_emoji: '📏',
        narrative: 'ข้าคือไม้บรรทัดที่วัดระยะผิดจนวิญญาณสถิต! จงหาผลลัพธ์นี้เพื่อปลดปล่อยข้า!',
        math_question: `เชือกสีแดงยาว ${a} เซนติเมตร เชือกสีดำยาวกว่าอยู่ ${b} เซนติเมตร เชือกสีดำยาวเท่าไร?`,
        correct_answer: ans,
        choices: [ans, ans + 5, Math.max(1, ans - 5), ans + 10],
        explanation_steps: [
          `ขั้นตอนที่ 1: เชือกแดงยาว ${a} ซม. เชือกดำยาวกว่า ${b} ซม.`,
          `ขั้นตอนที่ 2: เชือกดำยาว = ${a} + ${b}`,
          `ขั้นตอนที่ 3: คำนวณได้คำตอบคือ ${ans} เซนติเมตร`,
        ],
      };
    } else if (variant === 2) {
      const piles = randInt(3, 6);
      const perPile = randInt(4, 8);
      const total = piles * perPile;
      data = {
        ghost_type: 'ปีศาจกองสมุดการบ้าน',
        ghost_emoji: '📚',
        narrative: 'การบ้านคณิตศาสตร์กองโตกำลังลอยขึ้นกลางห้องด้วยพลังอาถรรพ์สูตรคูณ!',
        math_question: `จัดกองหนังสือเรียน ${piles} กอง กองละ ${perPile} เล่มเท่าๆ กัน รวมมีหนังสือทั้งหมดกี่เล่ม?`,
        correct_answer: total,
        choices: [total, total + piles, Math.max(1, total - piles), total + 4],
        explanation_steps: [
          `ขั้นตอนที่ 1: หนังสือมี ${piles} กอง กองละ ${perPile} เล่ม`,
          `ขั้นตอนที่ 2: ใช้การคูณ: ${piles} × ${perPile}`,
          `ขั้นตอนที่ 3: รวมทั้งหมด ${total} เล่ม`,
        ],
      };
    } else {
      const start = randInt(120, 350);
      const spent = randInt(40, 95);
      const ans = start - spent;
      data = {
        ghost_type: 'วิญญาณกระเป๋าสตางค์จำศีล',
        ghost_emoji: '👛',
        narrative: 'เหรียญในกระเป๋าดังกรุ๊งกริ๊งไม่ยอมหยุดตามจังหวะตัวเลข!',
        math_question: `มีเงินสะสม ${start} บาท ซื้อสมุดวาดภาพไป ${spent} บาท จะเหลือเงินกี่บาท?`,
        correct_answer: ans,
        choices: [ans, ans + 10, Math.max(1, ans - 10), ans + 20],
        explanation_steps: [
          `ขั้นตอนที่ 1: เงินเริ่มต้น ${start} บาท หักเงินที่จ่ายไป ${spent} บาท`,
          `ขั้นตอนที่ 2: ${start} - ${spent}`,
          `ขั้นตอนที่ 3: คงเหลือเงิน ${ans} บาท`,
        ],
      };
    }
  } else if (gradeLevel === 'ป.4') {
    if (variant === 1) {
      const rows = randInt(12, 24);
      const perRow = randInt(8, 15);
      const total = rows * perRow;
      data = {
        ghost_type: 'ปีศาจหนังสือเรียนปิดตาย',
        ghost_emoji: '📖',
        narrative: 'หน้ากระดาษหนังสือเล่มนี้กำลังพลิกเองด้วยแรงอาถรรพ์การคูณ!',
        math_question: `ห้องประชุมจัดเก้าอี้ไว้ ${rows} แถว แต่ละแถวมีเก้าอี้ ${perRow} ตัว รวมมีเก้าอี้ทั้งหมดกี่ตัว?`,
        correct_answer: total,
        choices: [total, total - 10, total + 10, total + 20],
        explanation_steps: [
          `ขั้นตอนที่ 1: คำนวณจำนวนเก้าอี้ทั้งหมดจากแถวและจำนวนตัวต่อแถว`,
          `ขั้นตอนที่ 2: ${rows} × ${perRow}`,
          `ขั้นตอนที่ 3: ได้เก้าอี้ทั้งหมด ${total} ตัว`,
        ],
      };
    } else if (variant === 2) {
      const width = randInt(6, 14);
      const length = randInt(15, 30);
      const area = width * length;
      data = {
        ghost_type: 'วิญญาณกระดานดำอาถรรพ์',
        ghost_emoji: '🪟',
        narrative: 'กระดานดำเรืองแสงเป็นตารางกริดปริศนา จงหาพื้นที่เพื่อสลายมนต์ดำ!',
        math_question: `กระดานดำรูปสี่เหลี่ยมผืนผ้า กว้าง ${width} เมตร ยาว ${length} เมตร จะมีพื้นที่กี่ตารางเมตร?`,
        correct_answer: area,
        choices: [area, area + width, Math.max(1, area - width), area + 20],
        explanation_steps: [
          `ขั้นตอนที่ 1: สูตรพื้นที่สี่เหลี่ยมผืนผ้า = กว้าง × ยาว`,
          `ขั้นตอนที่ 2: นำ ${width} × ${length}`,
          `ขั้นตอนที่ 3: พื้นที่เท่ากับ ${area} ตารางเมตร`,
        ],
      };
    } else {
      const total = randInt(120, 240);
      const groups = randInt(4, 8);
      const ans = Math.floor(total / groups);
      data = {
        ghost_type: 'ผีลูกแก้วกระจกแตกร้าว',
        ghost_emoji: '🔮',
        narrative: 'ลูกแก้วสะท้อนภาพเงาหลอนที่ต้องการแบ่งสรรปันส่วนอย่างเท่าเทียม!',
        math_question: `มีลูกแก้วเวทมนตร์ ${groups * ans} ลูก แบ่งใส่ถุง ${groups} ถุงเท่าๆ กัน แต่ละถุงจะได้กี่ลูก?`,
        correct_answer: ans,
        choices: [ans, ans + 2, Math.max(1, ans - 2), ans + 4],
        explanation_steps: [
          `ขั้นตอนที่ 1: การแบ่งเท่าๆ กันคือการหาร`,
          `ขั้นตอนที่ 2: ${groups * ans} ÷ ${groups}`,
          `ขั้นตอนที่ 3: แต่ละถุงจะได้ ${ans} ลูก`,
        ],
      };
    }
  } else if (gradeLevel === 'ป.5') {
    if (variant === 1) {
      const base = randInt(30, 90) * 10;
      const discount = randInt(1, 4) * 10;
      const ans = (base * discount) / 100;
      data = {
        ghost_type: 'ผีนาฬิกาทรายสูญสลาย',
        ghost_emoji: '⏳',
        narrative: 'ทรายแห่งกาลเวลากำลังไหลย้อนกลับด้วยคำสาปร้อยละและสัดส่วน!',
        math_question: `กระเป๋านักเรียนติดป้ายราคา ${base} บาท ทางร้านจัดโปรโมชั่นลดราคา ${discount}% จะได้ส่วนลดกี่บาท?`,
        correct_answer: ans,
        choices: [ans, ans + 20, Math.max(1, ans - 20), ans + 50],
        explanation_steps: [
          `ขั้นตอนที่ 1: ส่วนลด ${discount}% คือ (${discount} / 100) × ราคาเต็ม`,
          `ขั้นตอนที่ 2: (${discount} / 100) × ${base}`,
          `ขั้นตอนที่ 3: คิดเป็นเงินส่วนลด ${ans} บาท`,
        ],
      };
    } else if (variant === 2) {
      const w = randInt(3, 8);
      const l = randInt(4, 10);
      const h = randInt(2, 6);
      const vol = w * l * h;
      data = {
        ghost_type: 'ปีศาจกล่องไม้ต้องสาป',
        ghost_emoji: '📦',
        narrative: 'กล่องไม้มิติพิศวงกำลังดูดกลืนสิ่งของด้วยสูตรหาปริมาตรทรงสี่เหลี่ยมมุมฉาก!',
        math_question: `กล่องทรงสี่เหลี่ยมมุมฉาก กว้าง ${w} ซม. ยาว ${l} ซม. สูง ${h} ซม. มีปริมาตรกี่ลูกบาศก์เซนติเมตร?`,
        correct_answer: vol,
        choices: [vol, vol + 10, Math.max(1, vol - 10), vol + 24],
        explanation_steps: [
          `ขั้นตอนที่ 1: สูตรปริมาตร = กว้าง × ยาว × สูง`,
          `ขั้นตอนที่ 2: ${w} × ${l} × ${h}`,
          `ขั้นตอนที่ 3: ปริมาตรเท่ากับ ${vol} ลูกบาศก์เซนติเมตร`,
        ],
      };
    } else {
      const price = randInt(40, 150);
      const vat = 10;
      const ans = (price * vat) / 100;
      data = {
        ghost_type: 'วิญญาณใบเสร็จมืดมน',
        ghost_emoji: '🧾',
        narrative: 'ตัวเลขทศนิยมบนใบเสร็จกำลังบิดเบี้ยวเป็นใบหน้าของภูติผี!',
        math_question: `สมุดบันทึกราคาเล่มละ ${price} บาท ต้องจ่ายภาษีร้อยละ ${vat}% คิดเป็นเงินภาษีกี่บาท?`,
        correct_answer: ans,
        choices: [ans, ans + 2, Math.max(0.5, ans - 2), ans + 5],
        explanation_steps: [
          `ขั้นตอนที่ 1: ภาษี ${vat}% ของ ${price} บาท`,
          `ขั้นตอนที่ 2: (${vat} / 100) × ${price}`,
          `ขั้นตอนที่ 3: ได้ภาษี ${ans} บาท`,
        ],
      };
    }
  } else if (gradeLevel === 'ป.6') {
    if (variant === 1) {
      const x = randInt(5, 16);
      const m = randInt(2, 6);
      const c = randInt(5, 20);
      const total = m * x + c;
      data = {
        ghost_type: 'จอมมารสมการตัวแปร x',
        ghost_emoji: '🔮',
        narrative: 'พลังแห่งความลึกลับของตัวแปร x กำลังสะกดห้องเรียนนี้ไว้ จงถอดรหัสหาค่า x!',
        math_question: `จงหาค่าของ x จากสมการ: ${m}x + ${c} = ${total}`,
        correct_answer: x,
        choices: [x, x + 2, Math.max(1, x - 2), x + 4],
        explanation_steps: [
          `ขั้นตอนที่ 1: ย้าย ${c} ไปลบออกจาก ${total}: ${m}x = ${total} - ${c} = ${total - c}`,
          `ขั้นตอนที่ 2: ย้าย ${m} ไปหาร: x = ${total - c} ÷ ${m}`,
          `ขั้นตอนที่ 3: ได้ค่า x = ${x}`,
        ],
      };
    } else if (variant === 2) {
      const cost = randInt(20, 60) * 10;
      const profitRate = randInt(1, 4) * 10;
      const profit = (cost * profitRate) / 100;
      data = {
        ghost_type: 'ภูติเหรียญทองคำสาป',
        ghost_emoji: '🪙',
        narrative: 'ความโลภและการค้าขายในอดีตปลุกปีศาจกำไรขึ้นมา!',
        math_question: `ซื้อชุดเครื่องเขียนมาราคาต้นทุน ${cost} บาท ขายต่อได้กำไร ${profitRate}% ขายชุดเครื่องเขียนนี้ได้กำไรกี่บาท?`,
        correct_answer: profit,
        choices: [profit, profit + 20, Math.max(10, profit - 20), profit + 40],
        explanation_steps: [
          `ขั้นตอนที่ 1: กำไร ${profitRate}% = (${profitRate} / 100) × ต้นทุน`,
          `ขั้นตอนที่ 2: (${profitRate} / 100) × ${cost}`,
          `ขั้นตอนที่ 3: ได้กำไร ${profit} บาท`,
        ],
      };
    } else {
      const x = randInt(7, 20);
      const m = randInt(3, 5);
      const c = randInt(6, 18);
      const total = m * x - c;
      data = {
        ghost_type: 'ราชันย์เงาแห่งสัดส่วน',
        ghost_emoji: '👑',
        narrative: 'คำสาปสมการลบกำลังกัดกร่อนความจริง จงค้นหาค่าของตัวแปร x!',
        math_question: `จงแก้สมการหาค่า x: ${m}x - ${c} = ${total}`,
        correct_answer: x,
        choices: [x, x + 3, Math.max(1, x - 3), x + 5],
        explanation_steps: [
          `ขั้นตอนที่ 1: ย้าย ${c} ไปบวก: ${m}x = ${total} + ${c} = ${total + c}`,
          `ขั้นตอนที่ 2: ย้าย ${m} ไปหาร: x = ${total + c} ÷ ${m}`,
          `ขั้นตอนที่ 3: ได้คำตอบ x = ${x}`,
        ],
      };
    }
  } else {
    // ป.3 (Default)
    if (variant === 1) {
      const rows = randInt(4, 9);
      const cols = randInt(5, 8);
      const occupied = randInt(6, Math.min(rows * cols - 5, 25));
      const empty = rows * cols - occupied;
      data = {
        ghost_type: 'ผีโต๊ะเรียนอาถรรพ์',
        ghost_emoji: '🪵',
        narrative: 'โต๊ะตัวนี้เคยมีนักเรียนสอบตกวิชาเลขร้องไห้จนเกิดพลังงานอาถรรพ์ ปลดปล่อยข้าด้วยการคำนวณ!',
        math_question: `โต๊ะเรียนในห้องมี ${rows} แถว แถวละ ${cols} ตัว มีนักเรียนนั่งไปแล้ว ${occupied} ตัว จะเหลือโต๊ะว่างกี่ตัว?`,
        correct_answer: empty,
        choices: [empty, empty + 2, Math.max(1, empty - 2), empty + 4],
        explanation_steps: [
          `ขั้นตอนที่ 1: หาโต๊ะเรียนทั้งหมด: ${rows} × ${cols} = ${rows * cols} ตัว`,
          `ขั้นตอนที่ 2: ลบจำนวนที่มีคนนั่ง: ${rows * cols} - ${occupied}`,
          `ขั้นตอนที่ 3: เหลือโต๊ะว่าง ${empty} ตัว`,
        ],
      };
    } else if (variant === 2) {
      const hours = randInt(2, 5);
      const mins = hours * 60;
      data = {
        ghost_type: 'วิญญาณนาฬิกาตายหน้าห้อง',
        ghost_emoji: '🕰️',
        narrative: 'เข็มนาฬิกาโบราณชอบเดินทวนเข็มยามเที่ยงคืน เพื่อขโมยเวลานักเรียน!',
        math_question: `นักเรียนทำกิจกรรมปราบผีเป็นเวลา ${hours} ชั่วโมง คิดเป็นเวลากี่นาที?`,
        correct_answer: mins,
        choices: [mins, mins + 30, Math.max(30, mins - 30), mins + 60],
        explanation_steps: [
          `ขั้นตอนที่ 1: 1 ชั่วโมง เท่ากับ 60 นาที`,
          `ขั้นตอนที่ 2: นำ ${hours} ชั่วโมง × 60`,
          `ขั้นตอนที่ 3: ได้ผลลัพธ์เท่ากับ ${mins} นาที`,
        ],
      };
    } else {
      const boxes = randInt(4, 7);
      const perBox = randInt(6, 10);
      const total = boxes * perBox;
      data = {
        ghost_type: 'ปีศาจกล่องชอล์กหายนะ',
        ghost_emoji: '📦',
        narrative: 'ชอล์กในกล่องกำลังถูกบดขยี้ด้วยแรงลึกลับจนเกิดควันตัวเลข!',
        math_question: `ครูซื้อชอล์กมา ${boxes} กล่อง แต่ละกล่องมีชอล์ก ${perBox} แท่ง รวมมีชอล์กทั้งหมดกี่แท่ง?`,
        correct_answer: total,
        choices: [total, total + boxes, Math.max(1, total - boxes), total + 6],
        explanation_steps: [
          `ขั้นตอนที่ 1: มีกล่องชอล์ก ${boxes} กล่อง กล่องละ ${perBox} แท่ง`,
          `ขั้นตอนที่ 2: ${boxes} × ${perBox}`,
          `ขั้นตอนที่ 3: รวมมีชอล์กทั้งหมด ${total} แท่ง`,
        ],
      };
    }
  }

  // Ensure unique choices and contains correct answer
  const unique = Array.from(new Set(data.choices));
  while (unique.length < 4) {
    const candidate = data.correct_answer + unique.length * 2;
    if (!unique.includes(candidate)) {
      unique.push(candidate);
    }
  }

  return {
    ...data,
    choices: unique.slice(0, 4).sort(() => Math.random() - 0.5),
    explanation_steps: data.explanation_steps || [
      `ขั้นตอนที่ 1: วิเคราะห์โจทย์ "${data.math_question}"`,
      `ขั้นตอนที่ 2: ดำเนินการคำนวณตามลำดับ`,
      `ขั้นตอนที่ 3: สรุปคำตอบที่ถูกต้องคือ ${data.correct_answer}`,
    ],
  };
}
