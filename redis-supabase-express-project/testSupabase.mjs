import { supabase } from './src/config/database.mjs';

const test = async () => {
  const { data, error } = await supabase.from('api_keys').select('*');
  console.log({ data, error });
}

test();
