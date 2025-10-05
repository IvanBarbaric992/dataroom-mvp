import { ArrowLeft, FileQuestion, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@/components/common/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="group relative">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative rounded-full bg-muted p-8 transition-transform duration-300 group-hover:scale-110">
          <FileQuestion className="h-24 w-24 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="max-w-md text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or
          you might have mistyped the URL.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Button className="gap-2" size="lg" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>

        <Button asChild className="gap-2" size="lg" variant="outline">
          <Link to="/">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>

      <div className="mt-16 text-xs text-muted-foreground">Error Code: 404 • Page Not Found</div>
    </div>
  );
};

export default NotFound;
