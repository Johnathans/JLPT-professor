import { NextRequest, NextResponse } from 'next/server';

interface KanjiResponse {
  kanji: string;
  grade: number;
  jlpt: number | null;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  unicode: string;
}

// List of JLPT N5 kanji
const N5_KANJI = [
  '日', '一', '国', '人', '年', '大', '十', '二', '本', '中',
  '長', '出', '三', '時', '行', '見', '月', '分', '後', '前',
  '生', '五', '間', '上', '東', '四', '今', '金', '九', '入',
  '学', '高', '円', '子', '外', '八', '六', '下', '来', '気',
  '小', '七', '山', '話', '女', '北', '午', '百', '書', '先',
  '名', '川', '千', '水', '半', '男', '西', '電', '校', '語',
  '土', '木', '聞', '食', '車', '何', '南', '万', '毎', '白',
  '天', '母', '火', '右', '読', '友', '左', '休', '父', '雨'
];

// List of JLPT N4 kanji
const N4_KANJI = [
  // People & Professions
  '会', '同', '事', '自', '社', '発', '者', '業', '員', '先',
  '役', '医', '仕', '相', '軍', '農', '州', '係', '取',

  // Actions & States
  '立', '開', '手', '力', '問', '代', '動', '通', '言', '使',
  '思', '持', '始', '運', '終', '着', '待', '急', '止', '付',
  '走', '行', '起', '速', '歩', '渡', '表', '働', '練', '研',
  '勝', '負', '位', '消', '現', '戻', '直', '合', '当', '向',

  // Places & Locations
  '地', '場', '京', '所', '屋', '館', '島', '池', '寺', '市',
  '町', '港', '谷', '村', '洋', '岸', '岩', '角', '階',

  // Time & Events
  '朝', '昼', '夜', '春', '秋', '冬', '度', '期', '週', '曜',
  '昨', '毎', '約', '化', '記', '点', '数', '番', '線', '次',

  // Objects & Things
  '品', '具', '台', '才', '画', '算', '世', '両', '全', '式',
  '服', '帳', '面', '羽', '船', '石', '音', '歌', '紙', '米',
  '麦', '茶', '油', '糸', '皿', '鉄', '銀', '馬', '鳥', '魚',

  // Qualities & States
  '正', '安', '重', '近', '遠', '反', '古', '悪', '暗', '太',
  '好', '早', '弱', '低', '短', '軽', '固', '熱', '温', '冷',
  '甘', '新', '青', '赤', '色', '黄', '黒', '白', '別', '特',

  // Abstract Concepts
  '意', '心', '界', '教', '文', '元', '公', '私', '実', '主',
  '題', '要', '理', '体', '信', '命', '死', '神', '精', '性',
  '法', '科', '利', '害', '産', '際', '和', '平', '戦', '争',

  // Nature & Environment
  '空', '海', '野', '林', '草', '竹', '花', '葉', '炭', '氷',
  '光', '星', '雲', '風', '雪', '波', '形'
];

// List of JLPT N3 kanji
const N3_KANJI = [
  // Abstract Concepts & Ideas
  '結', '続', '変', '比', '対', '部', '必', '要', '査', '常',
  '得', '解', '決', '確', '認', '説', '論', '義', '議', '条',
  '参', '求', '質', '断', '告', '報', '応', '備', '試', '験',
  '象', '景', '影', '型', '状', '情', '性', '格', '能', '可',
  '許', '証', '権', '限', '務', '責', '任', '判', '制', '務',

  // Actions & Activities
  '過', '失', '違', '差', '置', '押', '引', '選', '残', '示',
  '折', '望', '満', '末', '味', '配', '達', '良', '候', '最',
  '省', '倒', '巻', '捕', '探', '済', '接', '授', '援', '断',
  '改', '革', '張', '優', '収', '与', '給', '課', '担', '検',
  '査', '承', '認', '提', '供', '構', '減', '増', '税', '製',

  // People & Society
  '政', '治', '法', '制', '経', '済', '産', '業', '労', '働',
  '協', '商', '売', '資', '株', '企', '団', '連', '役', '係',
  '側', '他', '党', '共', '総', '領', '県', '都', '府', '市',
  '区', '町', '村', '戸', '庫', '所', '館', '屋', '室', '庭',

  // Time & Change
  '期', '程', '過', '際', '回', '転', '変', '更', '改', '移',
  '進', '退', '増', '減', '続', '残', '復', '帰', '逆', '順',

  // Nature & Environment
  '植', '根', '草', '林', '森', '丸', '枝', '葉', '花', '実',
  '岸', '岩', '砂', '島', '波', '池', '湖', '谷', '崎', '温',
  '寒', '暖', '涼', '熱', '冷', '暑', '寒', '乾', '湿', '雨',

  // Objects & Materials
  '材', '器', '具', '品', '装', '置', '管', '箱', '包', '巻',
  '板', '枚', '布', '糸', '皮', '紙', '竹', '鉄', '銅', '油',

  // Qualities & States
  '固', '軽', '重', '厚', '薄', '濃', '淡', '深', '浅', '遠',
  '低', '高', '長', '短', '広', '狭', '速', '遅', '早', '良',
  '悪', '優', '劣', '美', '醜', '善', '悪', '真', '偽', '正'
];

export async function GET(
  request: NextRequest,
  { params }: { params: { level: string } }
) {
  try {
    const { level } = params;
    const jlptLevel = parseInt(level.replace('n', ''));
    
    if (isNaN(jlptLevel) || jlptLevel < 1 || jlptLevel > 5) {
      return NextResponse.json(
        { error: 'Invalid JLPT level. Must be between n1 and n5.' },
        { status: 400 }
      );
    }

    // First get all kanji
    const response = await fetch('https://kanjiapi.dev/v1/kanji/all');
    if (!response.ok) {
      throw new Error(`Failed to fetch kanji list: ${response.status}`);
    }

    const allKanji = await response.json();
    const batchSize = 50; // Process 50 kanji at a time
    const results = [];

    // Process kanji in batches
    for (let i = 0; i < allKanji.length; i += batchSize) {
      const batch = allKanji.slice(i, i + batchSize);
      const batchPromises = batch.map(async (kanji: string) => {
        try {
          const response = await fetch(`https://kanjiapi.dev/v1/kanji/${kanji}`);
          if (!response.ok) {
            return null;
          }
          const details: KanjiResponse = await response.json();
          
          // Only include kanji that match our JLPT level
          if (details.jlpt === jlptLevel) {
            return {
              kanji: details.kanji,
              meanings: details.meanings,
              onyomi: details.on_readings,
              kunyomi: details.kun_readings,
              info: {
                grade: details.grade,
                jlpt: details.jlpt,
                strokeCount: details.stroke_count,
                unicode: details.unicode
              }
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching details for ${kanji}:`, error);
          return null;
        }
      });

      // Wait for the current batch to complete
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter((k): k is NonNullable<typeof k> => k !== null));

      // Add a small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch JLPT kanji data' },
      { status: 500 }
    );
  }
}
