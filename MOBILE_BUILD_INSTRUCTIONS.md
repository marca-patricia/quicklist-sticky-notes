# 📱 Instruções para Publicar no Google Play Store

## 🚀 Passos para Gerar o APK/AAB

### 1. **Exportar para GitHub**
- Clique no botão "Export to Github" no Lovable
- Faça git pull do projeto no seu repositório local

### 2. **Instalar Dependências**
```bash
npm install
```

### 3. **Adicionar Plataforma Android**
```bash
npx cap add android
```

### 4. **Atualizar Dependências Nativas**
```bash
npx cap update android
```

### 5. **Build do Projeto**
```bash
npm run build
```

### 6. **Sincronizar com Capacitor**
```bash
npx cap sync
```

### 7. **Abrir no Android Studio**
```bash
npx cap open android
```

### 8. **No Android Studio:**

#### Para APK (Testing):
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Encontre o APK em: `android/app/build/outputs/apk/debug/`

#### Para AAB (Play Store):
1. Build → Generate Signed Bundle / APK
2. Escolha "Android App Bundle"
3. Configure o keystore (crie um novo se necessário)
4. Build Release
5. Encontre o AAB em: `android/app/build/outputs/bundle/release/`

## 🔑 Configuração do Keystore (Para Produção)

### Criar Keystore:
```bash
keytool -genkey -v -keystore quicklist-release-key.keystore -alias quicklist -keyalg RSA -keysize 2048 -validity 10000
```

### Configurar no Android Studio:
- File → Project Structure → Modules → app → Signing Configs
- Adicione as informações do keystore

## 📋 Checklist antes de publicar:

- [ ] Ícone do app configurado
- [ ] Nome do app correto
- [ ] Versão incrementada no `android/app/build.gradle`
- [ ] Permissões necessárias configuradas
- [ ] Testado em dispositivo físico
- [ ] Screenshots para a Play Store
- [ ] Descrição e metadados preparados

## 🎯 Configurações Importantes:

### Versão do App:
Edite `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Ícone do App:
Substitua os arquivos em:
`android/app/src/main/res/mipmap-*/ic_launcher.png`

## 🔗 Links Úteis:
- [Google Play Console](https://play.google.com/console)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Blog Post Lovable](https://lovable.dev/blogs/TODO)

---
**Nota**: Lembre-se de sempre fazer `npx cap sync` após mudanças no código web!