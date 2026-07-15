import { redirect } from "next/navigation";

// Free Throw was removed. Any old link now bounces to MSG Hoops.
// You can delete this whole folder: rm -rf frontend/app/freethrow
export default function FreeThrowRemoved() {
  redirect("/hoops");
}
