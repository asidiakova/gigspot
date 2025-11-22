import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { container } from "@/container";
import { ProfileView } from "./profile-view";
import { notFound } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null; 
  }

  const user = await container.userRepository.findById(session.user.id);
  
  if (!user) {
    notFound();
  }

  const { passwordHash, ...safeUser } = user;

  return <ProfileView user={safeUser} />;
}
