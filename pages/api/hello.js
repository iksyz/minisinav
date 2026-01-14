// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export const runtime = 'experimental-edge';

export default function handler() {
  return new Response(JSON.stringify({ name: 'John Doe' }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
