function AuthDivider() {
  return (
    <div className="relative py-1">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-background px-3 text-caption text-muted-foreground">
          or
        </span>
      </div>
    </div>
  );
}

export default AuthDivider;
