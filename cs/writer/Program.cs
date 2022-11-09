using System;
using System.IO;
using OfficeOpenXml;
using static System.Environment;
using static System.IO.File;
using OfficeOpenXml.FormulaParsing;
using System.Linq;
using OfficeOpenXml.FormulaParsing.Excel.Functions;
using System.Collections.Generic;
using System.Text;
using OfficeOpenXml.FormulaParsing.ExpressionGraph;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;

namespace CalcTheSheet
{
    class Program
    {
        static void Main(string[] args)
        {
            String[] arguments = GetCommandLineArgs();
            string filePath = args[0];
            string outputPath = args[1];

            FileInfo src = new FileInfo(filePath);
            FileInfo dest = new FileInfo(outputPath);

            if (dest.Exists)
            {
                dest.Delete();
            }
            File.Copy(src.FullName, dest.FullName);
            ExcelPackage package = new ExcelPackage(new FileInfo(dest.FullName));
            
            if (package != null)
            {
                package.Workbook.FormulaParserManager.AddOrReplaceFunction("sumifs", new MySumIfs());
                package.Workbook.Calculate();

                package.SaveAs(dest);
            }
            Exit(1);
        }

    }

    public class MySumIfs : MultipleRangeCriteriasFunction
    {
        public override CompileResult Execute(IEnumerable<FunctionArgument> arguments, ParsingContext context)
        {

            var functionArguments = arguments as FunctionArgument[] ?? arguments.ToArray();

            ValidateArguments(functionArguments, 3);
            var rows = new List<int>();
            var valueRange = functionArguments[0].ValueAsRangeInfo;

            List<double> sumRange;
            if (valueRange != null)
            {
                sumRange = ArgsToDoubleEnumerableZeroPadded(true, valueRange, context).ToList();
            }
            else
            {
                sumRange = ArgsToDoubleEnumerable(true, new List<FunctionArgument> { functionArguments[0] }, context).Select(x => (double)x).ToList();
            }
            var argRanges = new List<ExcelDataProvider.IRangeInfo>();
            var criterias = new List<string>();
            for (var ix = 1; ix < 31; ix += 2)
            {
                if (functionArguments.Length <= ix) break;
                var rangeInfo = functionArguments[ix].ValueAsRangeInfo;
                argRanges.Add(rangeInfo);
                var value = functionArguments[ix + 1].Value != null ? functionArguments[ix + 1].Value.ToString() : null;
                criterias.Add(value);
            }
            IEnumerable<int> matchIndexes = GetMatchIndexes(argRanges[0], criterias[0]);

            var enumerable = matchIndexes as IList<int> ?? matchIndexes.ToList();
            for (var ix = 1; ix < argRanges.Count && enumerable.Any(); ix++)
            {
                var indexes = GetMatchIndexes(argRanges[ix], criterias[ix]);
                matchIndexes = enumerable.Intersect(indexes);
                enumerable = matchIndexes as IList<int> ?? matchIndexes.ToList();
            }
            var result = matchIndexes.Sum(index => sumRange[index]);
            return CreateResult(result, DataType.Decimal);
        }
    }
}
