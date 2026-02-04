import z from "zod";
import { nullableToOptional } from "../nullableToUndefined.js";
import { InvalidBodyError } from "../../../../errors/infra/controller/InvalidBodyError.js";

export function validateCreateTodolistParams(data: unknown) {
  const schema = z.object({
    ownerId: z.uuid(),
    title: z.string(),
    daysWeekToRepeat: nullableToOptional(
      z
        .array(
          z.union([
            z.literal(0),
            z.literal(1),
            z.literal(2),
            z.literal(3),
            z.literal(4),
            z.literal(5),
            z.literal(6),
          ]),
        )
        .nonempty(),
    ),
    todoMotivationPhrase: nullableToOptional(z.string()),
    plannedDayToMake: nullableToOptional(z.date().nullish()),
    expirationDt: nullableToOptional(z.date().nullish()),
  });

  const parsedData = schema.safeParse(data);
  if (parsedData.error) {
    throw new InvalidBodyError(
      `${JSON.stringify(z.treeifyError(parsedData.error).properties)}`,
    );
  }

  return parsedData.data;
}
