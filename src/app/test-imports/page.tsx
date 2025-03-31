'use client';

import { N3_KANJI, N4_KANJI, N5_KANJI } from '@/data/jlpt-kanji-updated';

export default function TestImportsPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#7c4dff' }}>JLPT Kanji Count Information</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#5e35b1' }}>N3 Kanji: {N3_KANJI.length} kanji</h2>
        <p>The N3 level typically has around 370 kanji.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {N3_KANJI.slice(0, 10).map((kanji, index) => (
            <div key={index} style={{ border: '1px solid #e8e3ff', borderRadius: '8px', padding: '10px', background: '#f8f7ff' }}>
              <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '5px' }}>{kanji.kanji}</div>
              <div dangerouslySetInnerHTML={{ __html: kanji.reading }}></div>
              <div style={{ fontSize: '12px', color: '#666' }}>{kanji.meaning}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#5e35b1' }}>N4 Kanji: {N4_KANJI.length} kanji</h2>
        <p>The N4 level typically has around 170 kanji.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {N4_KANJI.slice(0, 10).map((kanji, index) => (
            <div key={index} style={{ border: '1px solid #e8e3ff', borderRadius: '8px', padding: '10px', background: '#f8f7ff' }}>
              <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '5px' }}>{kanji.kanji}</div>
              <div dangerouslySetInnerHTML={{ __html: kanji.reading }}></div>
              <div style={{ fontSize: '12px', color: '#666' }}>{kanji.meaning}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#5e35b1' }}>N5 Kanji: {N5_KANJI.length} kanji</h2>
        <p>The N5 level typically has around 80 kanji.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {N5_KANJI.slice(0, 10).map((kanji, index) => (
            <div key={index} style={{ border: '1px solid #e8e3ff', borderRadius: '8px', padding: '10px', background: '#f8f7ff' }}>
              <div style={{ fontSize: '24px', textAlign: 'center', marginBottom: '5px' }}>{kanji.kanji}</div>
              <div dangerouslySetInnerHTML={{ __html: kanji.reading }}></div>
              <div style={{ fontSize: '12px', color: '#666' }}>{kanji.meaning}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '30px', padding: '15px', background: '#e8e3ff', borderRadius: '8px' }}>
        <h3 style={{ color: '#5e35b1', margin: '0 0 10px 0' }}>Total JLPT Kanji: {N3_KANJI.length + N4_KANJI.length + N5_KANJI.length}</h3>
        <p style={{ margin: '0' }}>The JLPT Professor application now provides comprehensive kanji lists for N3, N4, and N5 levels.</p>
      </div>
    </div>
  );
}
