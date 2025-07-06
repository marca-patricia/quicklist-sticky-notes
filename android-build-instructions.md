
# Instruções para Build Android - QuickList

## Pré-requisitos
- Node.js instalado
- Android Studio instalado
- Java JDK 17 ou superior

## Passos para Build de Produção

### 1. Preparar o projeto
```bash
# Instalar dependências
npm install

# Build do projeto
npm run build

# Sincronizar com Capacitor
npx cap sync android
```

### 2. Abrir no Android Studio
```bash
npx cap open android
```

### 3. Configurar no Android Studio
- Vá em Build → Generate Signed Bundle/APK
- Selecione "Android App Bundle" (recomendado para Google Play)
- Crie ou selecione seu keystore
- Defina as versões:
  - versionCode: 1 (incremente para cada update)
  - versionName: "1.0.0"

### 4. Build para Produção
- Selecione "release" build variant
- Build → Make Project
- Build → Generate Signed Bundle

### 5. Arquivo final
O arquivo .aab será gerado em:
`android/app/release/app-release.aab`

## Informações para Google Play Console

### Informações do App
- **Nome do App**: QuickList
- **Descrição**: Organizador de listas de tarefas simples e eficiente
- **Categoria**: Produtividade
- **Classificação**: Livre para todos

### Permissões necessárias
- INTERNET (para PWA features)
- WRITE_EXTERNAL_STORAGE (para instalação)

### Screenshots necessários
- Pelo menos 2 screenshots por dispositivo (telefone/tablet)
- Ícone de alta resolução (512x512px)

## Próximos passos
1. Criar conta de desenvolvedor no Google Play Console
2. Upload do arquivo .aab
3. Preencher informações da loja
4. Configurar política de privacidade
5. Submeter para revisão
