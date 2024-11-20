"use client";

import { useMutation, useQuery } from "convex/react";
import styles from "./page.module.css";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  inputField: z.string().min(1, "Input is required"),
});

export default function Home() {
	const { isSignedIn, user } = useUser();
  	const userRole = user?.publicMetadata?.role;
  
	const [text, setText] = useState('');
	const createItem = useMutation(api.items.createItem);
	const items = useQuery(api.items.getItems);
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	const onSubmit = (data) => {
		console.log(data);
	};
	
	if (!isSignedIn) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className="text-red-500">
            Please sign in to view the items.
          </div>
        </main>
      </div>
    );
  }
	
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<div className="flex flex-col space-y-4 p-4">
					{items?.map(item => {
						return <div key={item._id} className="text-lg">
							{item.text}
						</div>
					})}
				</div>
				{userRole === "teacher" ? (
          <div className="flex items-center space-x-2">
			 
				<form onSubmit={handleSubmit(onSubmit)}>
					<input
					{...register("inputField")}
					placeholder="Enter something"
					/>
					{errors.inputField && <p>{errors.inputField.message}</p>}
					<button type="submit">Submit</button>
				</form>
			 
            <form onSubmit={e => {
              e.preventDefault();
              createItem({ text });
              setText('');
            }}>
              <Input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Create
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-red-500">
            You do not have permission to create items.
          </div>
        )}
      </main>
		</div>
	);
}