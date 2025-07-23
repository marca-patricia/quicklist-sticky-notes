-- Create enum for priority levels
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high');

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  list_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create todo lists table
CREATE TABLE public.todo_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create list items table
CREATE TABLE public.list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  due_date TIMESTAMP WITH TIME ZONE,
  priority priority_level DEFAULT 'medium',
  list_id UUID NOT NULL REFERENCES public.todo_lists(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create item categories junction table
CREATE TABLE public.item_categories (
  item_id UUID REFERENCES public.list_items(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, category_id)
);

-- Enable Row Level Security
ALTER TABLE public.todo_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for todo_lists
CREATE POLICY "Users can view their own lists" 
ON public.todo_lists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lists" 
ON public.todo_lists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists" 
ON public.todo_lists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists" 
ON public.todo_lists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for list_items
CREATE POLICY "Users can view items from their lists" 
ON public.list_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.todo_lists 
  WHERE id = list_items.list_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create items in their lists" 
ON public.list_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.todo_lists 
  WHERE id = list_items.list_id AND user_id = auth.uid()
));

CREATE POLICY "Users can update items in their lists" 
ON public.list_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.todo_lists 
  WHERE id = list_items.list_id AND user_id = auth.uid()
));

CREATE POLICY "Users can delete items from their lists" 
ON public.list_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.todo_lists 
  WHERE id = list_items.list_id AND user_id = auth.uid()
));

-- Create RLS policies for categories
CREATE POLICY "Users can view categories from their lists" 
ON public.categories 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.todo_lists 
  WHERE id = categories.list_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create categories in their lists" 
ON public.categories 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.todo_lists 
  WHERE id = categories.list_id AND user_id = auth.uid()
));

CREATE POLICY "Users can update categories in their lists" 
ON public.categories 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.todo_lists 
  WHERE id = categories.list_id AND user_id = auth.uid()
));

CREATE POLICY "Users can delete categories from their lists" 
ON public.categories 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.todo_lists 
  WHERE id = categories.list_id AND user_id = auth.uid()
));

-- Create RLS policies for item_categories
CREATE POLICY "Users can view item categories from their lists" 
ON public.item_categories 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.list_items li
  JOIN public.todo_lists tl ON li.list_id = tl.id
  WHERE li.id = item_categories.item_id AND tl.user_id = auth.uid()
));

CREATE POLICY "Users can create item categories in their lists" 
ON public.item_categories 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.list_items li
  JOIN public.todo_lists tl ON li.list_id = tl.id
  WHERE li.id = item_categories.item_id AND tl.user_id = auth.uid()
));

CREATE POLICY "Users can delete item categories from their lists" 
ON public.item_categories 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.list_items li
  JOIN public.todo_lists tl ON li.list_id = tl.id
  WHERE li.id = item_categories.item_id AND tl.user_id = auth.uid()
));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_todo_lists_updated_at
  BEFORE UPDATE ON public.todo_lists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();