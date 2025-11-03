import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Upload, Sparkles, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6 max-w-6xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-handwritten font-bold text-foreground">
              YouSpace
            </h1>
            <p className="text-sm font-serif italic text-muted-foreground">
              Your Shared Memory Book
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            data-testid="button-login"
          >
            Sign In
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-20">
          <h2 className="text-5xl md:text-6xl font-handwritten font-bold text-foreground">
            Capture Moments.<br />Share Stories.<br />Create Memories.
          </h2>
          <p className="text-xl font-serif text-muted-foreground max-w-2xl mx-auto">
            A warm, cozy space where friends and loved ones come together to upload photos and notes. 
            Our AI weaves your shared moments into beautiful, cohesive memory books.
          </p>
          <div className="pt-4">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="text-lg px-8 py-6"
              data-testid="button-get-started"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl font-serif">Shared Spaces</CardTitle>
              <CardDescription className="text-base">
                Create a space and invite friends to contribute their favorite moments together
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl font-serif">Easy Uploads</CardTitle>
              <CardDescription className="text-base">
                Add photos and short notes about what made each moment special
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl font-serif">AI Stories</CardTitle>
              <CardDescription className="text-base">
                Transform your memories into warm, beautifully crafted narratives
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-12 pb-12 space-y-6">
              <h3 className="text-3xl font-serif font-semibold">
                Ready to create your first memory book?
              </h3>
              <p className="text-lg text-muted-foreground">
                Join friends and family in capturing life's precious moments
              </p>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="text-lg px-8"
                data-testid="button-cta-signup"
              >
                Sign In to Start
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 max-w-6xl text-center text-sm text-muted-foreground">
          <p className="font-serif">
            YouSpace - Creating beautiful memory books together
          </p>
        </div>
      </footer>
    </div>
  );
}
