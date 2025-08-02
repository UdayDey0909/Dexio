# API Services

[← Back to README](../README.md)

## Overview

Dexio includes comprehensive API services for all Pokémon data, built on top of the PokeAPI with TypeScript support and intelligent caching.

## Service Modules

| Service       | Description        | Endpoints                      | Status     |
| ------------- | ------------------ | ------------------------------ | ---------- |
| **Pokemon**   | Core Pokémon data  | 1000+ Pokémon, stats, sprites  | ✅ Complete |
| **Ability**   | Pokémon abilities  | 327+ abilities with effects    | ✅ Complete |
| **Type**      | Type effectiveness | 18 types, matchups, damage     | ✅ Complete |
| **Move**      | Battle moves       | 1000+ moves with details       | ✅ Complete |
| **Evolution** | Evolution chains   | Complete evolution trees       | ✅ Complete |
| **Item**      | Held items         | 1600+ items with effects       | ✅ Complete |
| **Berry**     | Berry data         | 64 berries with flavors        | ✅ Complete |
| **Location**  | Game locations     | Regions, areas, encounters     | ✅ Complete |
| **Game**      | Game versions      | Generations, versions, Pokedex | ✅ Complete |
| **Machine**   | TMs/HMs            | Technical machines data        | ✅ Complete |
| **Contest**   | Contest data       | Contest types and effects      | ✅ Complete |
| **Encounter** | Encounter methods  | How Pokémon are found          | ✅ Complete |
| **Utility**   | Helper functions   | Resource utilities             | ✅ Complete |

## Implementation Details

### Service Architecture

Each service module follows a consistent pattern:

```typescript
// Service structure
src/Services/API/[Service]/
├── index.ts              # Main service exports
├── [Service]Core.ts      # Core API methods
├── [Service]Data.ts      # Data transformation
├── [Service]Random.ts    # Random data methods
└── [Service]Species.ts   # Species-specific methods
```

### Client Integration

The app uses a custom HTTP client with advanced features:

```typescript
// Base service with caching and error handling
class BaseService {
  protected async get<T>(endpoint: string): Promise<T> {
    // Automatic caching, retry logic, error handling
  }
}
```

## Usage Examples

### Fetching Pokémon Data

```typescript
// Get basic Pokémon info
const { data: pokemon, isLoading } = usePokemon('pikachu');

// Get detailed Pokémon stats
const { data: details } = usePokemonDetails('pikachu');

// Get Pokémon by type
const { data: firePokemon } = usePokemonByType('fire');
```

### Type Effectiveness

```typescript
// Get type matchups
const { data: matchups } = useTypeMatchup('fire');

// Calculate effectiveness
const effectiveness = calculateTypeEffectiveness(attackingType, defendingTypes);
```

### Evolution Chains

```typescript
// Get evolution chain
const { data: evolutionChain } = useEvolutionChain(1);

// Get evolution details
const { data: evolutionDetails } = useEvolutionChainDetails(1);
```

## Error Handling

All API services include robust error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **Rate Limiting**: Intelligent request throttling
- **Cache Failures**: Graceful fallback to network requests
- **Data Validation**: Type-safe data transformation

## Performance Features

- **Intelligent Caching**: Multi-layer caching strategy
- **Background Updates**: Automatic data refresh
- **Optimistic Updates**: Immediate UI feedback
- **Request Deduplication**: Prevent duplicate API calls

## Service Details

### Pokemon Service

- **Core Data**: Name, ID, types, stats, sprites
- **Species Info**: Evolution chains, habitat, capture rate
- **Forms**: Different forms and variants
- **Stats**: Base stats, EVs, IVs

### Ability Service

- **Ability Effects**: Detailed ability descriptions
- **Pokémon with Abilities**: Which Pokémon have each ability
- **Hidden Abilities**: Special ability information
- **Generation Data**: Ability availability by generation

### Type Service

- **Type Effectiveness**: Damage multipliers
- **Type Matchups**: Complete type interaction matrix
- **Pokémon by Type**: All Pokémon of each type
- **Moves by Type**: All moves of each type

### Move Service

- **Move Details**: Power, accuracy, PP, effects
- **Move Categories**: Physical, Special, Status
- **Move Learning**: How Pokémon learn moves
- **Move Effects**: Secondary effects and conditions

### Evolution Service

- **Evolution Chains**: Complete evolution trees
- **Evolution Triggers**: Level, item, trade, etc.
- **Evolution Conditions**: Specific requirements
- **Evolution Methods**: All possible evolution methods

### Item Service

- **Item Categories**: Held items, berries, TMs, etc.
- **Item Effects**: Battle and field effects
- **Item Attributes**: Cost, fling power, etc.
- **Item Locations**: Where items can be found

### Berry Service

- **Berry Types**: All berry varieties
- **Berry Flavors**: Spicy, dry, sweet, bitter, sour
- **Berry Firmness**: How hard berries are
- **Berry Growth**: Growth time and conditions

### Location Service

- **Regions**: All Pokémon regions
- **Areas**: Specific locations within regions
- **Encounters**: Pokémon found in each area
- **Location Methods**: How Pokémon appear

### Game Service

- **Generations**: All Pokémon generations
- **Versions**: Game versions and variants
- **Pokedex**: Regional Pokédex information
- **Version Groups**: Related game versions

### Machine Service

- **TMs/HMs**: Technical and Hidden Machines
- **Move Learning**: Which moves are TMs/HMs
- **Version Groups**: TM availability by version
- **Machine Numbers**: TM/HM numbering system

### Contest Service

- **Contest Types**: Cool, Beauty, Cute, Smart, Tough
- **Contest Effects**: What moves do in contests
- **Super Contests**: Advanced contest mechanics
- **Contest Stats**: Appeal, jam, etc.

### Encounter Service

- **Encounter Methods**: How Pokémon are encountered
- **Encounter Conditions**: Time, weather, etc.
- **Encounter Values**: Rarity and conditions
- **Encounter Slots**: Available Pokémon in each slot

### Utility Service

- **Resource Helpers**: URL parsing and validation
- **Batch Operations**: Multiple resource fetching
- **Random Resources**: Random data selection
- **Utility Functions**: Common helper functions
