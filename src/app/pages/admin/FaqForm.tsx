import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { useContent } from '../../contexts/ContentContext';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export function FaqForm() {
  const { homeFaqs, addHomeFaq, updateHomeFaq } = useContent();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editingId = id || null;

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!editingId) {
      setQuestion('');
      setAnswer('');
      return;
    }

    const existing = homeFaqs.find((f) => f.id === editingId);
    if (existing) {
      setQuestion(existing.question || '');
      setAnswer(existing.answer || '');
      setNotFound(false);
    } else if (homeFaqs.length > 0) {
      setNotFound(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId, homeFaqs.length]);

  const goBackToList = () => navigate('/admin/faqs');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion) return toast.error('Question is required');
    if (!trimmedAnswer) return toast.error('Answer is required');

    const now = new Date().toISOString();
    const existing = editingId ? homeFaqs.find((f) => f.id === editingId) : undefined;
    const payload = {
      question: trimmedQuestion,
      answer: trimmedAnswer,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    try {
      if (editingId) {
        await updateHomeFaq(editingId, payload);
        toast.success('FAQ updated successfully.');
      } else {
        await addHomeFaq(payload);
        toast.success('FAQ added successfully.');
      }
      goBackToList();
    } catch (err: any) {
      toast.error(err?.message || 'Save failed');
    }
  };

  if (editingId && notFound) {
    return (
      <Card>
        <CardContent className="space-y-4 p-8 text-center">
          <p className="text-gray-600">
            This FAQ could not be found. It may have been deleted.
          </p>
          <Button type="button" onClick={goBackToList} className="
  rounded-xl
  px-5
  font-semibold
  shadow-md
  transition-all
  duration-200
  cursor-pointer

  border-2
  border-brand-600
  bg-white
  text-brand-600

  hover:bg-white
  hover:brand-600
  hover:shadow-lg
  hover:text-brand-600
  hover:scale-[1.02]

  active:scale-[0.98]
">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to FAQs
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button type="button" variant="ghost" onClick={goBackToList} className="
  rounded-xl
  px-5
  font-semibold
  shadow-md
  transition-all
  duration-200
  cursor-pointer

  border-2
  border-brand-600
  bg-white
  text-brand-600

  hover:bg-white
  hover:brand-600
  hover:shadow-lg
  hover:text-brand-600
  hover:scale-[1.02]

  active:scale-[0.98]
">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to FAQs
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Update FAQ' : 'Add FAQ'}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                FAQ Details
              </h3>

              <div>
                <Label>Question *</Label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What services does Diksha Consulting and Projects provide?"
                  required
                />
              </div>

              <div>
                <Label>Answer *</Label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  placeholder="Write a clear answer that helps visitors and search engines understand your services."
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={goBackToList}
                className="h-11 px-6 rounded-lg cursor-pointer border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="h-11 px-8 rounded-lg bg-brand-700 text-white hover:bg-brand-800 cursor-pointer"
              >
                {editingId ? 'Update FAQ' : 'Add FAQ'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
