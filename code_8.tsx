// Obtén signOut del contexto, ya no necesitas supabase aquí para eso
const { user, signOut } = useUser();

// ... en tu JSX ...

// Para el botón de cerrar sesión:
// <Button onClick={signOut}>Cerrar Sesión</Button>

// Para mostrar el avatar del usuario:
// Accede a user.user_metadata.avatar_url en lugar de user.avatar_url
// Usa encadenamiento opcional (?.) para evitar errores si el usuario no ha iniciado sesión
<AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
