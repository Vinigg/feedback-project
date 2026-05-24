import { getSupabaseClient, requireData, type ServiceRecord } from './supabaseService';

export type QuestionType = 'technical' | 'behavioral';

export interface Question extends ServiceRecord {
  id: string;
  text: string;
  type: QuestionType;
  role?: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateQuestionData = Omit<Question, 'id' | 'created_at' | 'updated_at'> & ServiceRecord;
export type UpdateQuestionData = Partial<CreateQuestionData>;

export async function getQuestions(type?: QuestionType): Promise<Question[]> {
  const client = getSupabaseClient();
  let query = client
    .from('questions')
    .select('*')
    .order('category', { ascending: true });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query.order('text', { ascending: true });

  return requireData(data as Question[] | null, error);
}

export async function createQuestion(data: CreateQuestionData): Promise<Question> {
  const client = getSupabaseClient();
  const { data: question, error } = await client
    .from('questions')
    .insert(data)
    .select()
    .single();

  return requireData(question as Question | null, error);
}

export async function updateQuestion(id: string, data: UpdateQuestionData): Promise<Question> {
  const client = getSupabaseClient();
  const { data: question, error } = await client
    .from('questions')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  return requireData(question as Question | null, error);
}

export async function deleteQuestion(id: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client
    .from('questions')
    .delete()
    .eq('id', id);

  requireData(true, error);
}
