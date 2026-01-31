export default function Home() {
  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Minimal Test</h1>
      <p>If you see this, basic React rendering works.</p>
      <p>Current time: {new Date().toISOString()}</p>
    </div>
  );
}
