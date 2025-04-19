interface PlaceholderProps {
  text: string;
  width: number;
  height: number;
}

export default function Placeholder({ text, width, height }: PlaceholderProps) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#e8e3ff',
        color: '#7c4dff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        fontSize: '1.5rem',
        fontWeight: 600,
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      {text}
    </div>
  );
}
