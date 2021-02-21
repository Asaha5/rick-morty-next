// Simplified request abstraction. As we don't have any POST calls in this application, only
// GET requests are taken care of here

type RequestParams = {
  url: string;
};

export default async function request({ url }: RequestParams): Promise<any> {
  const response: Response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  throw new Error("Can not fetch data currently");
}

export async function requestMany(urls: string[]): Promise<any> {
  try {
    const responses = await Promise.all(urls.map(url => fetch(url).then(res => res.json())))
    return responses
  }
  catch(err){
    throw new Error("Can not fetch data currently");
  }
}
