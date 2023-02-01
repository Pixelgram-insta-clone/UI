import { PageOfItems } from "./PageOfItems";
import { Comment } from "./Comment";
import { User } from "./User";

export interface Post {
    id: number;
    // userId: number;
    user: User;
    img: string;
    description: string;
    createdOn: string;
    comments: PageOfItems<Comment>;
}
