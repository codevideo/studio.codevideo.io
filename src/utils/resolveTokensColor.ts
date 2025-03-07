export const resolveTokensColor = (tokens: number): 'mint' | 'amber' | 'tomato' => {
    if (!tokens) return 'tomato';
    let tokensColor: any = 'mint'

    if (tokens < 10) {
        tokensColor = 'amber'
    }
    if (tokens < 5) {
        tokensColor = 'tomato'
    }
    return tokensColor
}