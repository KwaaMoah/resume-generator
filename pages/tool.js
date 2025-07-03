import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Tool() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the HTML tool
    window.location.href = '/resume-tool.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to resume tool...</p>
    </div>
  );
}
