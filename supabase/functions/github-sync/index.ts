
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Extract the repo ID from the request
    const { repoId } = await req.json()
    
    if (!repoId) {
      return new Response(
        JSON.stringify({ error: 'Repository ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get repository information
    const { data: repo, error: repoError } = await supabaseClient
      .from('github_repositories')
      .select('*, github_accounts!inner(*)')
      .eq('id', repoId)
      .single()
    
    if (repoError || !repo) {
      console.error('Error fetching repository:', repoError)
      return new Response(
        JSON.stringify({ error: 'Repository not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // In a real implementation, we would:
    // 1. Use the GitHub API with the access_token from github_accounts
    // 2. Fetch commit data, PR data, issues, etc.
    // 3. Update the repository record with the new data
    
    // For this demo, we'll just simulate a successful update
    const mockUpdateData = {
      commit_count: Math.floor(Math.random() * 100),
      pr_count: Math.floor(Math.random() * 20),
      issue_count: Math.floor(Math.random() * 15),
      last_synced: new Date().toISOString()
    }
    
    // Update the repository with mock data
    const { error: updateError } = await supabaseClient
      .from('github_repositories')
      .update(mockUpdateData)
      .eq('id', repoId)
    
    if (updateError) {
      console.error('Error updating repository:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update repository data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Repository data updated',
        data: mockUpdateData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
