import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6 py-10">
      <div className="text-center">
        <div className="text-3xl mb-6">📚 🌿 📚</div>
        <SignIn />
      </div>
    </div>
  );
}
