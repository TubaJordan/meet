import userEvent from "@testing-library/user-event";
import NumberOfEvents from "../components/NumberOfEvents";
import { render } from "@testing-library/react";


describe("<NumberOfEvents /> Component", () => {

    let NumberOfEventsComponent;
    beforeEach(() => {
        NumberOfEventsComponent = render(<NumberOfEvents setCurrentNOE={() => { }} setErrorAlert={() => { }} />);
    });


    test("has the input textbox", () => {
        const input = NumberOfEventsComponent.queryByRole("spinbutton");
        expect(input).toBeInTheDocument();

    });

    test("default number of events is 32", () => {
        const input = NumberOfEventsComponent.queryByRole("spinbutton");
        expect(input).toHaveValue(32);
    });

    test("updates number of events when user types", async () => {
        const input = NumberOfEventsComponent.queryByRole("spinbutton");
        await userEvent.type(input, "{backspace}{backspace}10");
        expect(input).toHaveValue(10);
    });

});