import SEO from "../components/layout/SEO";
import { EditorPage } from "../components/pages/editor/EditorPage";
import { EditorLayout } from "../components/pages/editor/layout/EditorLayout";
export default function Editor() {
  return (
    <EditorLayout>
      <SEO
        title="CodeVideo Editor"
        description="Edit your CodeVideo project on a video and audio timeline."
        pathname="/editor"
        noIndex
      />
      <EditorPage />
    </EditorLayout>
  );
}
