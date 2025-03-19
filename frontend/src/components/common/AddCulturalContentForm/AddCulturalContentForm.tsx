import { useState } from "react";
import {
  addCulturalContent,
  updateCulturalContent,
} from "../../../services/speciesService";
import { CulturalContent } from "../../../models";

interface AddCulturalContentFormProps {
  speciesId: string;
  onSuccess: () => void;
  onCancel: () => void;
  defaultContentType?: "myth" | "legend" | "proverb";
  editingContent?: CulturalContent | null;
}

const AddCulturalContentForm = ({
  speciesId,
  onSuccess,
  onCancel,
  defaultContentType = "myth",
  editingContent = null,
}: AddCulturalContentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    contentType: editingContent?.contentType || defaultContentType,
    title: editingContent?.title || "",
    content: editingContent?.content || "",
    language: editingContent?.language || "en",
    source: editingContent?.source || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingContent) {
        // Update existing content
        await updateCulturalContent(editingContent.id, {
          title: formData.title,
          content: formData.content,
          source: formData.source,
        });
      } else {
        // Create new content
        await addCulturalContent({
          speciesId,
          contentType: formData.contentType,
          title: formData.title,
          content: formData.content,
          language: formData.language,
          source: formData.source || undefined,
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to submit content");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="contentType"
          className="block text-gray-700 font-medium mb-2"
        >
          Content Type*
        </label>
        <select
          id="contentType"
          name="contentType"
          value={formData.contentType}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          required
        >
          <option value="myth">Myth</option>
          <option value="legend">Legend</option>
          <option value="proverb">Proverb</option>
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          required
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-gray-700 font-medium mb-2"
        >
          Content*
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={4}
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          required
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="language"
          className="block text-gray-700 font-medium mb-2"
        >
          Language
        </label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
        >
          <option value="en">English</option>
          <option value="rw">Kinyarwanda</option>
          <option value="sw">Swahili</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="source"
          className="block text-gray-700 font-medium mb-2"
        >
          Source (Optional)
        </label>
        <input
          type="text"
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          placeholder="e.g., Oral tradition, Book name, etc."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Content"}
        </button>
      </div>
    </form>
  );
};

export default AddCulturalContentForm;
