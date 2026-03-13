export interface Blog {
    id: number;
    title: string;
    content: string;
    topic: string;
    image?: string;
    author: number;
    author_name: string;
    author_id: number;
    author_avatar?: string;
    likes_count?: number;
    is_liked?: boolean;
    is_following?: boolean;
    comments?: Comment[];
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: number;
    blog: number;
    author: number;
    author_name: string;
    author_avatar?: string;
    text: string;
    created_at: string;
}
