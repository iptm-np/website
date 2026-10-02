import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { RichTextEditor } from '../../components/ui/rich-text-editor';
import { useContent } from '../../contexts/ContentContext';
import { isHtmlEmpty } from '../../../utils/sanitize';
import { SanitizedHtml } from '../../components/ui/sanitized-html';
import { toast } from 'sonner';
import { Eye, EyeOff, Save, Globe } from 'lucide-react';

export function PrivacyPolicySection() {
  const { privacyPolicy, savePrivacyPolicy } = useContent();

  const [content, setContent] = useState(privacyPolicy?.content ?? '');
  const [isDirty, setIsDirty] = useState(false);
  const [savingAs, setSavingAs] = useState<'draft' | 'publish' | null>(null);
  const [preview, setPreview] = useState(false);

  // Sync if context value changes externally
  useEffect(() => {
    setContent(privacyPolicy?.content ?? '');
    setIsDirty(false);
  }, [privacyPolicy]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsDirty(true);
  };

  const handleSave = async (publish: boolean) => {
    setSavingAs(publish ? 'publish' : 'draft');
    try {
      const now = new Date().toISOString();
      await savePrivacyPolicy({
        content,
        isPublished: publish,
        createdAt: privacyPolicy?.createdAt ?? now,
        updatedAt: now,
        ...(publish
          ? { publishedAt: privacyPolicy?.publishedAt ?? now }
          : privacyPolicy?.publishedAt
          ? { publishedAt: privacyPolicy.publishedAt }
          : {}),
      });
      setIsDirty(false);
      toast.success(publish ? 'Privacy policy published' : 'Saved as draft');
    } catch (err: any) {
      toast.error(err?.message || 'Save failed');
    } finally {
      setSavingAs(null);
    }
  };

  const isPublished = privacyPolicy?.isPublished ?? false;
  const isBusy = savingAs !== null;

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Current status badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isPublished
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPublished ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                {isPublished ? 'Published' : 'Draft'}
              </span>
              {isDirty && (
                <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreview((v) => !v)}
              >
                {preview ? (
                  <><EyeOff className="h-4 w-4 mr-2" />Edit</>
                ) : (
                  <><Eye className="h-4 w-4 mr-2" />Preview</>
                )}
              </Button>

              {/* Save as Draft */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!isDirty || isBusy}
                onClick={() => handleSave(false)}
              >
                <Save className="h-4 w-4 mr-2" />
                {savingAs === 'draft' ? 'Saving…' : 'Save Draft'}
              </Button>

              {/* Publish */}
              <Button
                type="button"
                size="sm"
                disabled={isBusy || (!isDirty && isPublished)}
                onClick={() => handleSave(true)}
              >
                <Globe className="h-4 w-4 mr-2" />
                {savingAs === 'publish' ? 'Publishing…' : 'Publish'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor / Preview */}
      <Card>
        <CardHeader>
          <CardTitle>{preview ? 'Preview' : 'Content'}</CardTitle>
        </CardHeader>

        <CardContent>
          {preview ? (
            <SanitizedHtml
              html={content}
              className="max-w-none"
              emptyClassName="text-gray-400"
              fallback={<p className="text-gray-400">Nothing to preview yet.</p>}
            />
          ) : (
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your privacy policy..."
              minHeight="400px"
            />
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-600">Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
            <li>Use the toolbar to format content — headings, bold, italic, lists, links, and tables are all supported.</li>
            <li><strong>Save Draft</strong> saves your changes without making them visible to visitors.</li>
            <li><strong>Publish</strong> saves and immediately makes the policy live at <code className="bg-gray-100 px-1 rounded">/privacy-policy</code>.</li>
            <li>Toggle <strong>Preview</strong> to see rendered output before publishing.</li>
          </ul>
        </CardContent>
      </Card>


    </div>
  );
}

export default PrivacyPolicySection;
