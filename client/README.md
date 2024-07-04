 <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Chatter - A Modern Chat Application</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Chatter is a real-time chat application built with Node.js and React.js, designed to provide a seamless and
            engaging communication experience.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Key Features</h2>
          <ul className="mt-4 space-y-4 text-muted-foreground">
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <CheckIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Real-time Messaging</h3>
                <p>
                  Chatter uses WebSockets to enable instant messaging, ensuring your conversations are delivered in
                  real-time.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <CheckIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">User Presence Indicators</h3>
                <p>See when your friends are online and active, making it easy to start a conversation.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <CheckIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Customizable Profiles</h3>
                <p>Users can personalize their profiles with avatars, status messages, and more.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-6 w-6 text-primary"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Group Conversations</h3>
                <p>Create and join group chats to collaborate with multiple people simultaneously.</p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Installation</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>To get started with Chatter, follow these steps:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Clone the repository:
                <pre className="mt-2 bg-muted p-4 rounded-md">
                  <code>git clone https://github.com/your-username/chatter.git</code>
                </pre>
              </li>
              <li>
                Navigate to the project directory:
                <pre className="mt-2 bg-muted p-4 rounded-md">
                  <code>cd chatter</code>
                </pre>
              </li>
              <li>
                Install the dependencies:
                <pre className="mt-2 bg-muted p-4 rounded-md">
                  <code>npm install</code>
                </pre>
              </li>
              <li>
                Start the development server:
                <pre className="mt-2 bg-muted p-4 rounded-md">
                  <code>npm start</code>
                </pre>
              </li>
            </ol>
            <p>
              The application should now be running at <code>http://localhost:3000</code>.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Usage</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>To use Chatter, follow these steps:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Create an account by clicking the "Sign Up" button.</li>
              <li>Once logged in, you can start a new conversation by clicking the "New Chat" button.</li>
              <li>
                In the chat window, you can send messages, view the online status of your friends, and join group
                conversations.
              </li>
              <li>
                Customize your profile by clicking the user icon in the top right corner and updating your avatar,
                status, and other settings.
              </li>
            </ol>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">Links</h2>
          <div className="mt-4 space-y-2 text-muted-foreground">
            <p>
              <strong>GitHub Repository:</strong>{" "}
              <Link href="#" className="underline" prefetch={false}>
                https://github.com/your-username/chatter
              </Link>
            </p>
            <p>
              <strong>Deployed Application:</strong>{" "}
              <Link href="#" className="underline" prefetch={false}>
                https://chatter.example.com
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
