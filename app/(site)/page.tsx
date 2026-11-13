import { getSiteData } from "@/sanity/data";
import Portfolio from "./Portfolio";

export default async function Page() {
  const { projects, about } = await getSiteData();
  return (
    <Portfolio
      projects={projects}
      about={about}
      formKey={process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ""}
    />
  );
}
