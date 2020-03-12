import React from "react";
import {
  render,
  fireEvent,
  wait,
  within,
  handleResponse
} from "@testing-library/react";
import Dashboard from "../container/Dashboard";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
const mockAxios = new MockAdapter(axios);

const mockSingleArticle = [
  {
    isPublished: false,
    _id: "5e5e20a625449a001708e64f",
    subCategories: [],
    blocks: [],
    published: false,
    title: "This is a title",
    id: "48c78302-ff67-41c3-891d-920cc3efd04d",
    createdAt: "2020-03-03T09:17:26.312Z",
    updatedAt: "2020-03-03T09:17:26.312Z",
    __v: 0,
    topicAndSubtopicArray: []
  }
];

describe("Dashboard.js", () => {
  test("<Dashboard> should render", () => {
    const { getByText } = render(<Dashboard />);
    mockAxios
      .onGet("https://snaphunt-demo-backend.herokuapp.com/articles")
      .reply(200, mockSingleArticle);
    const DashboardComponent = getByText("Dashboard");
    expect(DashboardComponent).toBeInTheDocument();
  });
  test("Create New Article <Button> should render", () => {
    const { getByLabelText } = render(<Dashboard />);
    mockAxios
      .onGet("https://snaphunt-demo-backend.herokuapp.com/articles")
      .reply(200, mockSingleArticle);
    const addNewArticleButton = getByLabelText("Create New Article");
    expect(addNewArticleButton).toBeInTheDocument();
  });
  test("Test functionality of Create New Article Button", () => {
    const createNewArticle = jest.fn();
    const { getByLabelText } = render(
      <Dashboard createNewArticle={createNewArticle} />
    );
    mockAxios
      .onGet("https://snaphunt-demo-backend.herokuapp.com/articles")
      .reply(200, mockSingleArticle);
    const addNewArticleButton = getByLabelText("Create New Article");
    fireEvent.click(addNewArticleButton);
    expect(createNewArticle).toHaveBeenCalled();
  });
  test("Should return parent container that contains all article titles", () => {
    const { getByLabelText } = render(<Dashboard />);
    mockAxios
      .onGet("https://snaphunt-demo-backend.herokuapp.com/articles")
      .reply(200, mockSingleArticle);
    const articleTitleContainer = getByLabelText("article-title-container");
    expect(articleTitleContainer).toBeInTheDocument();
  });

  test("Should render article titles", async () => {
    const { getByLabelText } = render(<Dashboard />);
    mockAxios
      .onGet("https://snaphunt-demo-backend.herokuapp.com/articles")
      .reply(200, mockSingleArticle);
    await wait(() => getByLabelText("article-title"));
    const { getByText } = within(getByLabelText("article-title"));
    expect(getByText(`1. ${mockSingleArticle[0].title}`)).toBeInTheDocument();
  });

  test("Should throw error if URL is invalid", async () => {
    const GET = async url => {
      const response = await axios.get(url, { withCredentials: true });
      return handleResponse(response);
    };
    mockAxios
      .onGet("https://snaphunt-demo-backend.herokuapp.com/articles")
      .reply(500, []);
    const expectedError = async () => {
      await GET("https://snaphunt-demo-backend.herokuapp.com/articles");
    };
    return expect(expectedError()).rejects.toThrowError();
  });
});
