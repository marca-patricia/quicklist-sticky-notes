-- Add missing foreign key constraints
ALTER TABLE public.categories 
ADD CONSTRAINT categories_list_id_fkey 
FOREIGN KEY (list_id) REFERENCES public.todo_lists(id) ON DELETE CASCADE;

ALTER TABLE public.list_items 
ADD CONSTRAINT list_items_list_id_fkey 
FOREIGN KEY (list_id) REFERENCES public.todo_lists(id) ON DELETE CASCADE;

ALTER TABLE public.item_categories 
ADD CONSTRAINT item_categories_item_id_fkey 
FOREIGN KEY (item_id) REFERENCES public.list_items(id) ON DELETE CASCADE;

ALTER TABLE public.item_categories 
ADD CONSTRAINT item_categories_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;