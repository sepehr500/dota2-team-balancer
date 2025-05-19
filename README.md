# Dota 2 Team Balancer

A web application that helps create balanced Dota 2 teams based on player ranks and preferred positions.

![Dota 2 Team Balancer](https://dota2-team-balancer.deno.dev/)

## Features

- **Player Input System**: Enter player information with name, rank (MMR), and preferred positions
- **Position Preferences**: Specify which positions (1-5) each player prefers to play
- **Smart Team Balancing**: Algorithm creates balanced teams considering:
  - Even distribution of player ranks (MMR)
  - Maximum position coverage for both teams
  - Multiple balanced team composition options
- **URL Sharing**: Share your player lineup via URL with encoded data parameters
- **Pre-filled Examples**: Comes with sample pro player data to demonstrate functionality
- **Interactive UI**: Clean, responsive interface with color-coded player indicators
- **Rank Difference Display**: See how balanced each team option is numerically

## How to Use

1. Enter player information in the text area using the format: `PlayerName,Rank,Positions`
   - Example: `Jim,1480,23` (Jim has 1480 MMR and prefers positions 2 and 3)
   - If you omit positions, the system assumes the player can play all positions (12345)

2. Add 10 players total (required for team balancing)

3. The system will automatically generate balanced team compositions, showing:
   - Radiant and Dire team distributions
   - Players assigned to each team
   - Rank difference between teams (lower is better)
   - Multiple team composition options

4. Share your setup by copying the URL, which includes your encoded player data

## Development

### Build for Production

```bash
# Build client and server
npm run build

# Preview production build
npm run preview
```

## Algorithm

The team balancing algorithm:

1. Considers all possible 5-player combinations (out of 10 players)
2. Evaluates each split based on:
   - Total position coverage for both teams
   - Absolute difference in total MMR/rank between teams
3. Sorts options by position coverage (descending) and rank difference (ascending)
4. Returns the top balanced team compositions

## Technologies

- React
- TypeScript
- Tailwind CSS
- Vite
- Express (for server-side rendering)

## License

MIT

---

Feel free to contribute by opening issues or submitting pull requests!
