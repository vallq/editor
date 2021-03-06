import React from "react";
import { render, fireEvent, wait, within } from "@testing-library/react";
import Editor from "../container/Editor";
import axios from "../utils/axios";
import MockAdapter from "axios-mock-adapter";
const mockAxios = new MockAdapter(axios);
jest.mock("@ckeditor/ckeditor5-react", () => {
  const hello = () => {
    return <div></div>;
  };
  return {
    __esModule: true,
    default: hello
  };
});

const mockUpdateFunction = jest.fn();
const mockArticle = {
  title: "412t",
  topicAndSubtopicArray: [
    {
      blockArray: ["<p>jskhkjhgkjdfhghkj</p>"],
      _id: "5e6f34fa802b2a05c4a6b204",
      title: "412t",
      containerId: "abcde"
    },
    {
      blockArray: ["<p>jfdkjhfjkdhfkjdhfkj</p>"],
      _id: "5e6f34fa802b2a05c4a6b205",
      title: "413",
      containerId: "efghi"
    }
  ],
  category: "Uncategorized",
  id: "0a6f72b5-169c-4580-84f7-45225c00420b",
  createdAt: "2020-03-16T08:12:42.991Z",
  updatedAt: "2020-03-16T08:12:42.991Z"
};

describe("Editor.js", () => {
  describe("Should render basic editor elements", () => {
    test("<Editor> should render", () => {
      const { getByLabelText } = render(
        <Editor articleTitle={""} articleId={""} />
      );
      const EditorComponent = getByLabelText("Editor");
      expect(EditorComponent).toBeInTheDocument();
    });

    test("Topic Title <Input> Box should render", () => {
      const { getByLabelText } = render(
        <Editor articleTitle={""} articleId={""} />
      );
      const TitleComponent = getByLabelText("Topic Title");
      expect(TitleComponent).toBeInTheDocument();
    });

    test("Topic Title <Input> Box is rendered with no text when creating new article", () => {
      const { getByLabelText } = render(
        <Editor articleTitle={""} articleId={""} />
      );
      const TitleComponent = getByLabelText("Topic Title");
      expect(TitleComponent).toBeInTheDocument();
      expect(TitleComponent.value).toEqual("");
    });

    test("Sub-Topic Title <Input> Box should render", () => {
      const { getByLabelText } = render(
        <Editor articleTitle={""} articleId={""} />
      );
      const TitleComponent = getByLabelText("Sub-Topic Title");
      expect(TitleComponent).toBeInTheDocument();
    });

    test("Sub-Topic Title <Input> Box is rendered with no text when creating new article", () => {
      const { getByLabelText } = render(
        <Editor articleTitle={""} articleId={""} />
      );
      const TitleComponent = getByLabelText("Sub-Topic Title");
      expect(TitleComponent).toBeInTheDocument();
      expect(TitleComponent.value).toEqual("");
    });

    test("Topic Title <Input> Box shows user typed value", () => {
      const { getByLabelText, getByDisplayValue } = render(
        <Editor articleTitle={""} articleId={""} />
      );
      const TitleComponent = getByLabelText("Topic Title");
      fireEvent.change(TitleComponent, {
        target: { value: "snapi topic title" }
      });
      const TopicTitleText = getByDisplayValue("snapi topic title");
      expect(TopicTitleText).toBeInTheDocument();
    });
    test("Sub-Topic Title <Input> Box shows user typed value", () => {
      const { getByLabelText, getByDisplayValue } = render(
        <Editor articleTitle={""} articleId={""} />
      );
      const TitleComponent = getByLabelText("Sub-Topic Title");
      fireEvent.change(TitleComponent, {
        target: { value: "snapi subtopic title" }
      });
      const subTopicTitleText = getByDisplayValue("snapi subtopic title");
      expect(subTopicTitleText).toBeInTheDocument();
    });
  });

  describe("Save Draft functionality", () => {
    describe("render savedModal", () => {
      test("should render 'successfully saved!' after axios is successfully", async () => {
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        mockAxios.onPost("/articles").reply(201);
        const topicTitleInputBox = getByLabelText("Topic Title");
        const subtopicTitleInputBox = getByLabelText("Sub-Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi" } });
        fireEvent.change(subtopicTitleInputBox, {
          target: { value: "Snapi2" }
        });
        const saveButton = getByLabelText("Save Button");
        fireEvent.click(saveButton);
        await wait(() =>
          expect(getByText("Successfully saved!")).toBeInTheDocument()
        );
      });

      test("Save modal box should close when clicked", async () => {
        const { queryByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        mockAxios.onPost("/articles").reply(201);
        const topicTitleInputBox = getByLabelText("Topic Title");
        const subtopicTitleInputBox = getByLabelText("Sub-Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi" } });
        fireEvent.change(subtopicTitleInputBox, {
          target: { value: "Snapi2" }
        });
        const saveButton = getByLabelText("Save Button");
        fireEvent.click(saveButton);
        await wait(() => fireEvent.click(getByLabelText("close save message")));
        const modalBox = queryByText("Successfully saved!");
        expect(modalBox).not.toBeInTheDocument();
      });
    });

    describe("Render Error Modals", () => {
      test("should render Error message when article title is empty", () => {
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        const saveButton = getByLabelText("Save Button");
        fireEvent.click(saveButton);
        const modalBox = getByText("Title cannot be empty.");
        expect(modalBox).toBeInTheDocument();
      });

      test("should render Error message when topic title is filled but subtopic title is not", async () => {
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        const topicTitleInputBox = getByLabelText("Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi" } });
        const saveButton = getByLabelText("Save Button");
        fireEvent.click(saveButton);
        wait(() =>
          expect(getByText("Title cannot be empty.")).toBeInTheDocument()
        );
      });

      test("Error modal box should close when clicked", () => {
        const { queryByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        const saveButton = getByLabelText("Save Button");
        fireEvent.click(saveButton);
        const closeErrorButton = getByLabelText("close error message");
        fireEvent.click(closeErrorButton);
        const modalBox = queryByText("Title cannot be empty.");
        expect(modalBox).not.toBeInTheDocument();
      });

      test("should render Error message when axios fail to accept duplicate article title for save draft functionality", async () => {
        mockAxios.onPost("/articles").reply(422);
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        const topicTitleInputBox = getByLabelText("Topic Title");
        const subtopicTitleInputBox = getByLabelText("Sub-Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi" } });
        fireEvent.change(subtopicTitleInputBox, {
          target: { value: "Snapi2" }
        });
        const saveButton = getByLabelText("Save Button");
        fireEvent.click(saveButton);
        wait(() =>
          expect(
            getByText(
              "Topic title cannot be a duplicate of existing titles. Please change your title."
            )
          ).toBeInTheDocument()
        );
      });
    });
  });

  describe("Publish functionality", () => {
    describe("render PublishModal", () => {
      test("should render 'Successfully published!' after axios is successful", async () => {
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        mockAxios.onGet("/publish/").reply(200, []);
        mockAxios.onPost("/publish").reply(201);
        mockAxios.onPost("/articles").reply(201);
        const topicTitleInputBox = getByLabelText("Topic Title");
        const subtopicTitleInputBox = getByLabelText("Sub-Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi3" } });
        fireEvent.change(subtopicTitleInputBox, {
          target: { value: "Snapi4" }
        });
        const publishButton = getByLabelText("Publish Button");
        fireEvent.click(publishButton);
        await wait(() => {
          expect(getByText("Published")).toBeInTheDocument();
        });
      });
      test("Save modal box should close when clicked", async () => {
        const { queryByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        mockAxios.onGet("/publish/").reply(200, []);
        mockAxios.onPost("/publish").reply(201);
        mockAxios.onPost("/articles").reply(201);
        const topicTitleInputBox = getByLabelText("Topic Title");
        const subtopicTitleInputBox = getByLabelText("Sub-Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi" } });
        fireEvent.change(subtopicTitleInputBox, {
          target: { value: "Snapi2" }
        });
        const publishButton = getByLabelText("Publish Button");
        fireEvent.click(publishButton);
        await wait(() =>
          fireEvent.click(getByLabelText("close publish message"))
        );
        const modalBox = queryByText("Successfully published!");
        expect(modalBox).not.toBeInTheDocument();
      });
    });

    describe("Render Error Modals", () => {
      test("should render Error message when article title is empty", () => {
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        const publishButton = getByLabelText("Publish Button");
        fireEvent.click(publishButton);
        const modalBox = getByText("Title cannot be empty.");
        expect(modalBox).toBeInTheDocument();
      });

      test("should render Error message when topic title is filled but subtopic title is not", async () => {
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        const topicTitleInputBox = getByLabelText("Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi" } });
        const publishButton = getByLabelText("Publish Button");
        fireEvent.click(publishButton);
        wait(() =>
          expect(getByText("Title cannot be empty.")).toBeInTheDocument()
        );
      });

      test("Error modal box should close when clicked", () => {
        const { queryByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        const publishButton = getByLabelText("Publish Button");
        fireEvent.click(publishButton);
        const closeErrorButton = getByLabelText("close error message");
        fireEvent.click(closeErrorButton);
        const modalBox = queryByText("Title cannot be empty.");
        expect(modalBox).not.toBeInTheDocument();
      });

      test("should render Error message when axios fail to accept duplicate article title for publish function", async () => {
        mockAxios.onPost("/publish").reply(422);
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={""}
            updateArticleId={mockUpdateFunction}
            articleId={""}
          />
        );
        const topicTitleInputBox = getByLabelText("Topic Title");
        const subtopicTitleInputBox = getByLabelText("Sub-Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi" } });
        fireEvent.change(subtopicTitleInputBox, {
          target: { value: "Snapi2" }
        });
        const publishButton = getByLabelText("Publish Button");
        fireEvent.click(publishButton);
        wait(() =>
          expect(
            getByText(
              "Topic title cannot be a duplicate of existing titles. Please change your title."
            )
          ).toBeInTheDocument()
        );
      });
    });

    describe("Publish Existing Data", () => {
      test("should PATCH to both collections when article exists in both", async () => {
        const mockArticleTitle = "Hello my name is tootoo";
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={mockArticleTitle}
            updateArticleId={mockUpdateFunction}
            articleId={mockArticle.id}
          />
        );
        mockAxios.onGet(`/articles/${mockArticleTitle}`).reply(200, [
          {
            id: mockArticle.id,
            title: mockArticleTitle,
            category: "Uncategorized",
            topicAndSubtopicArray: mockArticle.topicAndSubtopicArray
          }
        ]);
        mockAxios.onGet(`/publish/${mockArticle.id}`).reply(200, [mockArticle]);
        mockAxios.onPatch(`/publish/update/${mockArticle.id}`).reply(201);
        mockAxios.onPatch(`/articles/update/${mockArticle.id}`).reply(201);
        const topicTitleInputBox = getByLabelText("Topic Title");
        const subtopicTitleInputBox = getByLabelText("Sub-Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi3" } });
        fireEvent.change(subtopicTitleInputBox, {
          target: { value: "Snapi4" }
        });
        const publishButton = getByLabelText("Publish Button");
        fireEvent.click(publishButton);
        await wait(() => {
          expect(getByText("Published")).toBeInTheDocument();
        });
      });

      test("should POST to publish and PATCH to draft when article exists only in draft", async () => {
        const mockArticleTitle = "Hello my name is tootoo";
        const { getByText, getByLabelText } = render(
          <Editor
            articleTitle={mockArticleTitle}
            updateArticleId={mockUpdateFunction}
            articleId={mockArticle.id}
          />
        );
        mockAxios.onGet(`/articles/${mockArticleTitle}`).reply(200, [
          {
            id: mockArticle.id,
            title: mockArticleTitle,
            category: "Uncategorized",
            topicAndSubtopicArray: mockArticle.topicAndSubtopicArray
          }
        ]);
        mockAxios.onGet(`/publish/${mockArticle.id}`).reply(200, []);
        mockAxios.onPost("/publish").reply(201);
        mockAxios.onPatch(`/articles/update/${mockArticle.id}`).reply(201);
        const topicTitleInputBox = getByLabelText("Topic Title");
        const subtopicTitleInputBox = getByLabelText("Sub-Topic Title");
        fireEvent.change(topicTitleInputBox, { target: { value: "Snapi3" } });
        fireEvent.change(subtopicTitleInputBox, {
          target: { value: "Snapi4" }
        });
        const publishButton = getByLabelText("Publish Button");
        fireEvent.click(publishButton);
        await wait(() => {
          expect(getByText("Published")).toBeInTheDocument();
        });
      });
    });
  });

  describe("Return to Dashboard", () => {
    test("Return to Dashboard <Button> should render", () => {
      const { getByLabelText } = render(
        <Editor
          articleTitle={""}
          updateArticleId={mockUpdateFunction}
          articleId={""}
        />
      );
      const returnToDashContainer = getByLabelText("return to dashboard");
      const returnToDashBtn = within(returnToDashContainer).getByLabelText(
        "Return to Dashboard"
      );
      expect(returnToDashBtn).toBeInTheDocument();
    });

    test("Return to Dashboard <Button> should return to dashboard on click", async () => {
      const returnToDashboard = jest.fn();
      const { getByLabelText } = render(
        <Editor
          returnToDashboard={returnToDashboard}
          articleTitle={""}
          updateArticleId={mockUpdateFunction}
          articleId={""}
        />
      );
      const returnToDashContainer = getByLabelText("return to dashboard");
      const returnToDashBtn = within(returnToDashContainer).getByLabelText(
        "Return to Dashboard"
      );
      fireEvent.click(returnToDashBtn);
      expect(returnToDashboard).toHaveBeenCalled();
    });
  });

  describe("Edit and Preview", () => {
    test("Edit and Preview <Button> should render", () => {
      const { getByLabelText } = render(
        <Editor
          articleTitle={""}
          updateArticleId={mockUpdateFunction}
          articleId={""}
        />
      );
      const editBtn = getByLabelText("Edit Button");
      const previewBtn = getByLabelText("Preview Button");
      expect(editBtn).toBeInTheDocument();
      expect(previewBtn).toBeInTheDocument();
    });
    test("Click Preview and all add/delete buttons should not render", () => {
      const { getByLabelText, queryAllByLabelText } = render(
        <Editor
          articleTitle={""}
          updateArticleId={mockUpdateFunction}
          articleId={""}
        />
      );
      const regex = new RegExp(/^(add|delete).*button/, "i");
      const addBlockBtn = getByLabelText("add topicSubtopic 0 block button 0");
      const previewBtn = getByLabelText("Preview Button");
      fireEvent.click(addBlockBtn); //to make the block delete button render
      fireEvent.click(previewBtn);
      const allAddDeleteBtn = queryAllByLabelText(regex);
      expect(allAddDeleteBtn).toEqual([]);
    });
    test("Click Preview then Edit and all add/delete buttons should render", () => {
      const { getByLabelText, getAllByLabelText } = render(
        <Editor
          articleTitle={""}
          updateArticleId={mockUpdateFunction}
          articleId={""}
        />
      );
      const regex = new RegExp(/^(add|delete).*button/, "i");
      const addBlockBtn = getByLabelText("add topicSubtopic 0 block button 0");
      const editBtn = getByLabelText("Edit Button");
      const previewBtn = getByLabelText("Preview Button");
      fireEvent.click(addBlockBtn); //to make the block delete button render
      fireEvent.click(previewBtn);
      fireEvent.click(editBtn);
      const allAddDeleteBtn = getAllByLabelText(regex);
      expect(allAddDeleteBtn.length).toBe(7);
    });

    test("Last saved date of article should render when editing an existing article", async () => {
      const { getByLabelText } = render(
        <Editor
          articleTitle={"412t"}
          updateArticleId={mockUpdateFunction}
          articleId={mockArticle.id}
        />
      );
      mockAxios.onGet("/articles/412t").reply(200, [mockArticle]);
      mockAxios.onGet(`/publish/${mockArticle.id}`).reply(200, [mockArticle]);
      await wait(() => getByLabelText("Last saved label"));
      const { getByText } = within(getByLabelText("Last saved label"));
      expect(getByText("Last saved:")).toBeInTheDocument();
    });

    test("Last published date of article should render when editing an existing article", async () => {
      const { getByLabelText } = render(
        <Editor
          articleTitle={"412t"}
          updateArticleId={mockUpdateFunction}
          articleId={mockArticle.id}
        />
      );
      const isPublishedOrNew = jest.fn();
      isPublishedOrNew.mockReturnValue(true);
      mockAxios
        .onGet("/categories")
        .reply(200, ["Lemonade", "Lemonade 2", "Uncategorized"]);
      mockAxios.onGet(`/publish/${mockArticle.id}`).reply(200, [mockArticle]);
      mockAxios.onGet("/articles/412t").reply(200, [mockArticle]);
      await wait(() => getByLabelText("Last published label"));
      const { getByText } = within(getByLabelText("Last published label"));
      expect(getByText("Last published:")).toBeInTheDocument();
    });
  });

  describe("Delete functionality", () => {
    test("delete modal box renders when click on delete modal button", async () => {
      const { getByLabelText, getByText } = render(
        <Editor
          articleTitle={"412t"}
          updateArticleId={mockUpdateFunction}
          articleId={""}
        />
      );
      mockAxios.onGet("/articles/412t").reply(200, [mockArticle]);
      const deleteButton = getByLabelText("Remove Article");
      expect(deleteButton).toBeInTheDocument();
      fireEvent.click(deleteButton);
      await wait(() => getByText("Delete article?"));
      expect(getByText("Delete article?")).toBeInTheDocument();
    });

    test("delete modal box removes correct article when a deletion is confirmed", async () => {
      const { getByLabelText, getByText } = render(
        <Editor
          articleTitle={"412t"}
          updateArticleId={mockUpdateFunction}
          articleId={""}
        />
      );
      mockAxios.onGet("/articles/412t").reply(200, [mockArticle]);
      const deleteButton = getByLabelText("Remove Article");
      expect(deleteButton).toBeInTheDocument();
      fireEvent.click(deleteButton);
      await wait(() => getByText("No"));
      const exitDeleteModal = getByText("No");
      fireEvent.click(exitDeleteModal);
      expect(exitDeleteModal).not.toBeInTheDocument();
    });
  });

  describe("Category Menu Functionality", () => {
    test("Category Dropdown Menu is rendered with list of Categories", async () => {
      const categories = ["lemonade", "vanilla", "chocolate", "durian"];
      mockAxios.onGet("/categories").reply(200, categories);

      const { getByLabelText, queryAllByLabelText } = render(
        <Editor
          articleTitle={""}
          updateArticleId={mockUpdateFunction}
          articleId={""}
        />
      );
      expect(getByLabelText("CategoryDropDown")).toBeInTheDocument();

      await wait(() => {
        expect(queryAllByLabelText(/Category Option/).length).toBe(4);
      });
    });

    test("Selecting a category should display the correct category", async () => {
      const categories = ["lemonade", "vanilla", "chocolate", "durian"];
      mockAxios.onGet("/categories").reply(200, categories);

      const { getByLabelText } = render(
        <Editor
          articleTitle={""}
          updateArticleId={mockUpdateFunction}
          articleId={""}
        />
      );

      const categoryDropdown = getByLabelText("CategoryDropDown");
      expect(categoryDropdown).toBeInTheDocument();

      await wait(() => {
        fireEvent.change(categoryDropdown, { target: { value: "lemonade" } });
        expect(categoryDropdown.value).toBe("lemonade");
      });
    });
  });
});
