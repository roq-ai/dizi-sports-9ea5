const mapping: Record<string, string> = {
  'blog-posts': 'blog_post',
  'cricket-leagues': 'cricket_league',
  'live-scores': 'live_score',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
