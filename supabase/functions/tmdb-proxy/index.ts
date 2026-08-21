// Follow this setup guide to integrate the Deno runtime into your editor:
// https://deno.land/manual/getting_started/setup_your_environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const tmdbApiKey = Deno.env.get("TMDB_API_KEY");
    const tmdbBearerToken = Deno.env.get("TMDB_ACCESS_TOKEN");

    if (!tmdbApiKey && !tmdbBearerToken) {
      return new Response(
        JSON.stringify({
          error: "TMDB_API_KEY ou TMDB_ACCESS_TOKEN n'est pas configuré dans les secrets Supabase.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { action, query, id, language = "fr-FR", page = 1 } = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (tmdbBearerToken) {
      headers["Authorization"] = `Bearer ${tmdbBearerToken}`;
    }

    let url = "";

    if (action === "search") {
      if (!query || typeof query !== "string") {
        return new Response(
          JSON.stringify({ error: "Le paramètre 'query' est requis pour la recherche." }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const params = new URLSearchParams({
        query: query.trim(),
        language,
        page: String(page),
        include_adult: "false",
      });

      if (tmdbApiKey) {
        params.append("api_key", tmdbApiKey);
      }

      url = `${TMDB_BASE_URL}/search/movie?${params.toString()}`;
    } else if (action === "detail") {
      if (!id) {
        return new Response(
          JSON.stringify({ error: "Le paramètre 'id' est requis pour les détails." }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const params = new URLSearchParams({
        language,
        append_to_response: "credits,external_ids",
      });

      if (tmdbApiKey) {
        params.append("api_key", tmdbApiKey);
      }

      url = `${TMDB_BASE_URL}/movie/${encodeURIComponent(String(id))}?${params.toString()}`;
    } else {
      return new Response(
        JSON.stringify({ error: "Action inconnue. Utilisez 'search' ou 'detail'." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const tmdbResponse = await fetch(url, { headers });
    const data = await tmdbResponse.json();

    return new Response(JSON.stringify(data), {
      status: tmdbResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Erreur interne du proxy TMDB" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
