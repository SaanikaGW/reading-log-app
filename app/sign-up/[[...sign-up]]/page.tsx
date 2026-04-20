import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6 py-10">
      <div className="text-center">
        <div className="text-3xl mb-6">📚 🌿 📚</div>
        <SignUp />
      </div>
    </div>
  );
}
