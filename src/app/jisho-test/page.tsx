import JishoTest from '@/components/JishoTest';

export default function JishoTestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Jisho API Testing</h1>
      <JishoTest level="n5" word="日本" />
    </div>
  );
}
