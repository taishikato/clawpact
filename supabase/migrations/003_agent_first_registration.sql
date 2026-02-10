-- Agent-first registration: allow agents to register without auth and be claimed later

ALTER TABLE public.agents ADD COLUMN status TEXT NOT NULL DEFAULT 'claimed';
ALTER TABLE public.agents ADD CONSTRAINT agents_status_check CHECK (status IN ('unclaimed', 'claimed'));
ALTER TABLE public.agents ADD COLUMN claim_token TEXT UNIQUE;
ALTER TABLE public.agents ADD COLUMN api_key_hash TEXT;
ALTER TABLE public.agents ADD COLUMN api_key_prefix TEXT;

CREATE INDEX idx_agents_claim_token ON public.agents(claim_token) WHERE claim_token IS NOT NULL;
CREATE INDEX idx_agents_api_key_hash ON public.agents(api_key_hash) WHERE api_key_hash IS NOT NULL;
