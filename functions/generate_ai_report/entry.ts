import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { gender, age, height, weight, goals, measurements, user_name, user_email } = body || {};

    if (!gender || !age || !height || !weight) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `You are the AI sports-science engine for ELITE ART OF THE BODY, the global platform of WFF/WBBF International (bodybuilding, fitness, model & athletic physique). Analyze the person below and produce a bodybuilding/fitness body report. Provide educational, motivating, NON-medical guidance (do not diagnose disease or prescribe treatment).

Gender: ${gender}
Age: ${age}
Height: ${height} cm
Weight: ${weight} kg
BMI estimate: ${(weight / Math.pow(height / 100, 2)).toFixed(1)}
Goals: ${goals || 'General fitness and athletic development'}
Body measurements: ${measurements || 'Not provided'}

Return realistic values. body_score reflects overall conditioning potential (0-100). athlete_match reflects alignment with competitive athletic physique standards (0-100). suggested_category should be a real WFF/WBBF competition category (e.g. Men's Physique, Bikini Model, Bodybuilding, Athletic Body, Classic Bodybuilding). suggested_program should be a named 12-week program.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          body_score: { type: 'integer', description: '0-100 overall body conditioning score' },
          athlete_match: { type: 'integer', description: '0-100 athlete potential match percentage' },
          weight_recommendation: { type: 'string', description: 'general weight guidance' },
          training_guidance: { type: 'string', description: 'training direction, 2-3 sentences' },
          nutrition_guidance: { type: 'string', description: 'nutrition direction, 2-3 sentences' },
          suggested_category: { type: 'string', description: 'a WFF/WBBF competition category' },
          suggested_program: { type: 'string', description: 'a named 12-week program' }
        },
        required: ['body_score', 'athlete_match', 'weight_recommendation', 'training_guidance', 'nutrition_guidance', 'suggested_category', 'suggested_program']
      }
    });

    const report_id = 'EAB-' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 90 + 10);

    const saved = await base44.asServiceRole.entities.AIReport.create({
      report_id,
      user_name: user_name || 'Guest',
      user_email: user_email || '',
      gender,
      age,
      height,
      weight,
      goals: goals || '',
      body_score: result.body_score,
      athlete_match: result.athlete_match,
      weight_recommendation: result.weight_recommendation,
      training_guidance: result.training_guidance,
      nutrition_guidance: result.nutrition_guidance,
      suggested_category: result.suggested_category,
      suggested_program: result.suggested_program
    });

    return Response.json({ ...result, report_id, id: saved.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
