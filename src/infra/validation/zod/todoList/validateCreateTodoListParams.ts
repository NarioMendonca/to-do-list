import z from "zod";
import { InvalidBodyError } from "../../../../errors/infra/controller/InvalidBodyError.js";

export function validateCreateTodolistParams(data: unknown) {
  const schema = z.object({
    ownerId: z.uuid(),
    title: z.string(),
    daysWeekToRepeat: z
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
      .nonempty()
      .nullable(),
    todoMotivationPhrase: z.string().nullable(),
    plannedDtToMake: z.coerce.date().nullable(),
    expirationDt: z.coerce.date().nullable(),
  });

  const parsedData = schema.safeParse(data);
  if (parsedData.error) {
    throw new InvalidBodyError(
      `${JSON.stringify(z.treeifyError(parsedData.error).properties)}`,
    );
  }

  return parsedData.data;
}
